import axios from "axios";
import type { User, Address, HistoryRecord } from "../types";

export type ExportFormat = "json" | "csv";

export default class WFDService {
  /**
   * Get the current user's IP address
   * @description Get the current user's IP address
   * @returns {Promise<{ ip: string }>} Object containing the IP address
   */
  async getCurrentIP(): Promise<{ ip: string }> {
    try {
      const url = "https://api.ipify.org?format=json";
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to get current IP address:", error.message);
      }
      throw error;
    }
  }

  /**
   * Get coordinates for an IP address
   * @param ip IP address
   * @returns {Promise<{ latitude: number, longitude: number }>} Object containing coordinates
   */
  async getIPCoordinates(
    ip: string
  ): Promise<{ latitude: number; longitude: number }> {
    try {
      const url = `https://ipapi.co/${ip}/json/`;
      const response = await axios.get(url);
      const { latitude, longitude } = response.data;
      return { latitude, longitude };
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to get coordinates for IP(${ip}):`, error.message);
      }
      throw error;
    }
  }

  /**
   * Get random user information
   * @param country Country code
   * @returns {Promise<{ results: User[] }>} Object containing user information
   */
  async getRandomUser(country: string) {
    try {
      const url = `https://randomuser.me/api/?nat=${country}&inc=name,phone,id`;
      const response = await axios.get<{ results: User[] }>(url);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to get random user information (Country: ${country}):`, error.message);
      }
      throw error;
    }
  }

  /**
   * Get coordinates
   * @param country Country
   * @param state State/Province
   * @param city City
   * @returns {Promise<{ lat: number, lon: number }>} Object containing coordinates
   */
  async getCoordinates(country: string, state: string, city: string) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${city},${state},${country}&format=json&limit=1`;
      const response = await axios.get(url);
      const { lat, lon } = response.data[0];
      return { lat, lon };
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Failed to get geographic coordinates (${city}, ${state}, ${country}):`,
          error.message
        );
      }
      throw error;
    }
  }

  /**
   * Generate random latitude and longitude offsets
   * @param baseLatitude Base latitude
   * @param baseLongitude Base longitude
   * @returns {{ latitude: number, longitude: number }} Latitude and longitude with random offsets
   */
  private generateRandomOffset(baseLatitude: number, baseLongitude: number) {
    // Generate random offsets within approximately 1-2 kilometers
    const latOffset = (Math.random() - 0.5) * 0.02; // ±0.01 degrees is approximately 1 kilometer
    const lonOffset = (Math.random() - 0.5) * 0.02;
    return {
      latitude: baseLatitude + latOffset,
      longitude: baseLongitude + lonOffset,
    };
  }

  /**
   * Get random address
   * @param latitude Latitude
   * @param longitude Longitude
   * @returns {Promise<Address>} Object containing address
   */
  async getRandomAddress(
    latitude: number,
    longitude: number
  ): Promise<Address> {
    try {
      const { latitude: randomLat, longitude: randomLon } =
        this.generateRandomOffset(latitude, longitude);
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${randomLat}&lon=${randomLon}&format=json&accept-language=en`;
      const response = await axios.get(url);
      return response.data.address;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Failed to get random address (Coordinates: ${latitude}, ${longitude}):`,
          error.message
        );
      }
      throw error;
    }
  }

  /**
   * Export history records
   * @param history History record data
   * @param format Export format, default is json
   * @returns {Blob} Exported file as a Blob object
   */
  exportHistory(history: HistoryRecord[], format: ExportFormat = "json"): Blob {
    switch (format) {
      case "json":
        return new Blob([JSON.stringify(history, null, 2)], {
          type: "application/json",
        });
      // Support for other formats can be added here in the future
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Get export filename
   * @param format Export format
   * @returns {string} Filename
   */
  getExportFileName(format: ExportFormat = "json"): string {
    const date = new Date().toISOString().split("T")[0];
    return `address-history-${date}.${format}`;
  }

  /**
   * Generate Google Maps link
   * @param address Address object
   * @returns {string} Google Maps link
   */
  getGoogleMapUrl(address: Address): string {
    const addressString = [
      address.road,
      address.city,
      address.state,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      addressString
    )}`;
  }
}
