import { AxiosInstance, AxiosRequestConfig } from "axios";
import { Item } from "./models/Item";

export const enum HNClientErr {
  DATA_UNAVAILABE = 'Unable to GET data from HackerNews API',
}

type HttpClient = AxiosInstance;
type ReqConfig = AxiosRequestConfig;

export class HNApiClient {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async getMaxItemId(): Promise<number> {
    const path = '/maxitem.json'
    return this.get<number>(path);
  }

  async getItemById(id: number): Promise<Item> {
    const path = `/item/${id}.json`;
    return this.get<Item>(path);
  }

  private async get<T>(path: string, config?: ReqConfig): Promise<T> {
    const response = await this.client.get<T>(path, config);

    if (response.status !== 200) {
      throw new Error(HNClientErr.DATA_UNAVAILABE);
    }
    return response.data;
  }

}