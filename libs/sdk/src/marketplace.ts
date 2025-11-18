import { TMSAClient } from './client';
import { CreateListingDto, SearchListingsDto, PaginatedResponse, PaginationDto } from '@tmsa/types';

export class MarketplaceAPI {
  constructor(private client: TMSAClient) {}

  async createListing(data: CreateListingDto): Promise<any> {
    return this.client.post('/marketplace/listings', data);
  }

  async searchListings(params: SearchListingsDto & PaginationDto): Promise<PaginatedResponse<any>> {
    return this.client.get('/marketplace/listings/search', { params });
  }

  async getListingById(id: string): Promise<any> {
    return this.client.get(`/marketplace/listings/${id}`);
  }

  async myListings(params?: PaginationDto): Promise<PaginatedResponse<any>> {
    return this.client.get('/marketplace/listings/my', { params });
  }

  async updateListing(id: string, data: Partial<CreateListingDto>): Promise<any> {
    return this.client.patch(`/marketplace/listings/${id}`, data);
  }

  async cancelListing(id: string): Promise<void> {
    return this.client.delete(`/marketplace/listings/${id}`);
  }

  async expressInterest(listingId: string, message?: string): Promise<any> {
    return this.client.post(`/marketplace/listings/${listingId}/interest`, { message });
  }

  async getInterests(listingId: string): Promise<any[]> {
    return this.client.get(`/marketplace/listings/${listingId}/interests`);
  }

  async acceptInterest(listingId: string, interestId: string): Promise<any> {
    return this.client.post(`/marketplace/listings/${listingId}/interests/${interestId}/accept`);
  }

  async rejectInterest(listingId: string, interestId: string): Promise<void> {
    return this.client.post(`/marketplace/listings/${listingId}/interests/${interestId}/reject`);
  }

  async getMatches(): Promise<any[]> {
    return this.client.get('/marketplace/matches');
  }
}
