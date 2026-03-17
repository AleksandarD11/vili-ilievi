"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  adminCredentials,
  defaultAmenities,
  defaultAvailabilityEntries,
  defaultHeroContent,
  defaultHouses,
  defaultInquiries,
  normalizeAmenityRecord,
  normalizeHouseRecord,
  normalizeInquiryRecord,
  type AmenityRecord,
  type AvailabilityEntry,
  type AvailabilityStatus,
  type HouseRecord,
  type InquiryRecord,
  type InquiryStatus,
} from "@/lib/site-data";

type AdminStore = {
  isAuthenticated: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroBackgroundImage: string;
  houses: HouseRecord[];
  amenities: AmenityRecord[];
  availability: AvailabilityEntry[];
  inquiries: InquiryRecord[];
  loginError: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setHeroTitle: (heroTitle: string) => void;
  setHeroSubtitle: (heroSubtitle: string) => void;
  setHeroBackgroundImage: (heroBackgroundImage: string) => void;
  saveHouse: (house: HouseRecord) => void;
  addHouseImage: (houseId: string, imagePath: string) => void;
  deleteHouseImage: (houseId: string, imagePath: string) => void;
  setCoverImage: (houseId: string, imagePath: string) => void;
  updateAmenity: (amenityId: string, updatedData: Partial<AmenityRecord>) => void;
  upsertAvailability: (entry: AvailabilityEntry) => void;
  deleteAvailability: (entryId: string) => void;
  updateAvailabilityStatus: (entryId: string, status: AvailabilityStatus) => void;
  addInquiry: (inquiry: InquiryRecord) => void;
  updateInquiry: (inquiryId: string, updates: Partial<InquiryRecord>) => void;
  updateInquiryStatus: (inquiryId: string, status: InquiryStatus) => void;
  deleteInquiry: (inquiryId: string) => void;
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      heroTitle: defaultHeroContent.heroTitle,
      heroSubtitle: defaultHeroContent.heroSubtitle,
      heroBackgroundImage: defaultHeroContent.heroBackgroundImage,
      houses: defaultHouses.map(normalizeHouseRecord),
      amenities: defaultAmenities.map(normalizeAmenityRecord),
      availability: defaultAvailabilityEntries,
      inquiries: defaultInquiries,
      loginError: null,
      login: (username, password) => {
        const isValid =
          username === adminCredentials.username &&
          password === adminCredentials.password;

        set({
          isAuthenticated: isValid,
          loginError: isValid ? null : "Invalid credentials",
        });

        return isValid;
      },
      logout: () => set({ isAuthenticated: false, loginError: null }),
      setHeroTitle: (heroTitle) => set({ heroTitle }),
      setHeroSubtitle: (heroSubtitle) => set({ heroSubtitle }),
      setHeroBackgroundImage: (heroBackgroundImage) => set({ heroBackgroundImage }),
      saveHouse: (house) =>
        set((state) => ({
          houses: state.houses.map((item) =>
            item.id === house.id ? normalizeHouseRecord(house) : item,
          ),
        })),
      addHouseImage: (houseId, imagePath) =>
        set((state) => ({
          houses: state.houses.map((house) => {
            if (house.id !== houseId || !imagePath.trim()) {
              return house;
            }

            if (house.imagePaths.includes(imagePath)) {
              return house;
            }

            return {
              ...house,
              imagePaths: [...house.imagePaths, imagePath],
            };
          }),
        })),
      deleteHouseImage: (houseId, imagePath) =>
        set((state) => ({
          houses: state.houses.map((house) => {
            if (house.id !== houseId) {
              return house;
            }

            const nextImages = house.imagePaths.filter((item) => item !== imagePath);
            const nextCover =
              house.coverImage === imagePath ? nextImages[0] ?? "" : house.coverImage;

            return {
              ...house,
              coverImage: nextCover,
              imagePaths: nextImages,
            };
          }),
        })),
      setCoverImage: (houseId, imagePath) =>
        set((state) => ({
          houses: state.houses.map((house) =>
            house.id === houseId && house.imagePaths.includes(imagePath)
              ? { ...house, coverImage: imagePath }
              : house,
          ),
        })),
      updateAmenity: (amenityId, updatedData) =>
        set((state) => ({
          amenities: state.amenities.map((amenity) =>
            amenity.id === amenityId
              ? normalizeAmenityRecord({
                  ...amenity,
                  ...updatedData,
                  title: {
                    ...amenity.title,
                    ...(updatedData.title ?? {}),
                  },
                  description: {
                    ...amenity.description,
                    ...(updatedData.description ?? {}),
                  },
                })
              : amenity,
          ),
        })),
      upsertAvailability: (entry) =>
        set((state) => {
          const existing = state.availability.find((item) => item.id === entry.id);

          return {
            availability: existing
              ? state.availability.map((item) => (item.id === entry.id ? entry : item))
              : [...state.availability, entry],
          };
        }),
      deleteAvailability: (entryId) =>
        set((state) => ({
          availability: state.availability.filter((entry) => entry.id !== entryId),
        })),
      updateAvailabilityStatus: (entryId, status) =>
        set((state) => ({
          availability: state.availability.map((entry) =>
            entry.id === entryId ? { ...entry, status } : entry,
          ),
        })),
      addInquiry: (inquiry) =>
        set((state) => ({
          inquiries: [normalizeInquiryRecord(inquiry), ...state.inquiries].sort(
            (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
          ),
        })),
      updateInquiry: (inquiryId, updates) =>
        set((state) => ({
          inquiries: state.inquiries
            .map((inquiry) =>
              inquiry.id === inquiryId ? normalizeInquiryRecord({ ...inquiry, ...updates }) : inquiry,
            )
            .sort(
              (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
            ),
        })),
      updateInquiryStatus: (inquiryId, status) =>
        set((state) => ({
          inquiries: state.inquiries
            .map((inquiry) => (inquiry.id === inquiryId ? { ...inquiry, status } : inquiry))
            .sort(
              (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
            ),
        })),
      deleteInquiry: (inquiryId) =>
        set((state) => ({
          inquiries: state.inquiries.filter((inquiry) => inquiry.id !== inquiryId),
        })),
    }),
    {
      name: "vili-ilievi-admin-store",
      merge: (persistedState, currentState) => {
        const typedState = persistedState as Partial<AdminStore> | undefined;

        return {
          ...currentState,
          ...typedState,
          heroTitle: typedState?.heroTitle ?? currentState.heroTitle,
          heroSubtitle: typedState?.heroSubtitle ?? currentState.heroSubtitle,
          heroBackgroundImage: typedState?.heroBackgroundImage ?? currentState.heroBackgroundImage,
          houses: (typedState?.houses ?? currentState.houses).map(normalizeHouseRecord),
          amenities: (typedState?.amenities ?? currentState.amenities).map(normalizeAmenityRecord),
          availability: typedState?.availability ?? currentState.availability,
          inquiries: (typedState?.inquiries ?? currentState.inquiries)
            .map((inquiry) => normalizeInquiryRecord(inquiry))
            .sort(
              (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
            ),
        };
      },
      partialize: (state) => ({
        heroTitle: state.heroTitle,
        heroSubtitle: state.heroSubtitle,
        heroBackgroundImage: state.heroBackgroundImage,
        houses: state.houses,
        amenities: state.amenities,
        availability: state.availability,
        inquiries: state.inquiries,
      }),
    },
  ),
);
