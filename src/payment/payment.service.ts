import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationInterface } from './interfaces/ValidationInterface';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DarajaAccessTokenResponse } from './interfaces/AccessTokenResponse.interface';

@Injectable()
export class PaymentService {
  private baseUrl: string;
  private shortcode: string;
  private consumerKey: string;
  private consumerSecret: string;
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>('MPESA_BASE_URL');
    this.shortcode = this.configService.getOrThrow<string>('MPESA_SHORTCODE');
    this.consumerKey =
      this.configService.getOrThrow<string>('MPESA_CONSUMER_KEY');
    this.consumerSecret = this.configService.getOrThrow<string>(
      'MPESA_CONSUMER_SECRET',
    );
  }

  /** Get M-Pesa access token */
  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`,
    ).toString('base64');

    const response = await axios.get<DarajaAccessTokenResponse>(
      `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );

    console.log(response.data.access_token);
    return response.data.access_token;
  }

  /**  Initiate C2B simulation */
  async simulateC2B(amount: number, phone: string, accountNumber: number) {
    const accNumber = accountNumber.toString();
    const token = await this.getAccessToken();

    const payload = {
      ShortCode: this.shortcode,
      CommandID: 'CustomerPayBillOnline',
      Amount: amount,
      Msisdn: phone, // phone must be in format 2547XXXXXXXX
      BillRefNumber: accNumber, // account number/customer reference
    };

    const res = await axios.post(
      `${this.baseUrl}/mpesa/c2b/v1/simulate`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  }

  async validateTransaction(body: any) {
    console.log('Raw Body:', JSON.stringify(body, null, 2));

    const accountNumber = Number(body.BillRefNumber);
    console.log(accountNumber);

    const business = await this.prisma.business.findUnique({
      where: { accountNumber },
    });

    if (!business) {
      return {
        ResultCode: 'C2B00012',
        ResultDesc: 'Invalid Account Number',
      };
    }

    return {
      ResultCode: '0',
      ResultDesc: 'Accepted',
    };
  }

  async confirmTransaction(body: any) {
    console.log('Confirmation Payload:', JSON.stringify(body, null, 2));

    const transTime = body.TransTime
      ? new Date(
          body.TransTime.replace(
            /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
            '$1-$2-$3T$4:$5:$6',
          ),
        )
      : new Date();

    // Store in DB
    const payment = await this.prisma.payment.create({
      data: {
        transactionId: body.TransID,
        accountNumber: Number(body.BillRefNumber),
        amount: parseFloat(body.TransAmount),
        phone: body.MSISDN,
        payerName: [body.FirstName, body.MiddleName, body.LastName]
          .filter(Boolean)
          .join(' '), // full name
        transactionTime: transTime,
      },
    });

    return {
      ResultCode: 0,
      ResultDesc: 'Success',
    };
  }
}
