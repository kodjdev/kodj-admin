import { ApiResponse } from '@/types/common';
import {
    Meetup,
    Speaker,
    SpeakerFormData,
    Note,
    NoteFormData,
    Keynote,
    KeynoteFormData,
    MeetupPaginationParams,
    MeetupResponse,
    MeetupDetails,
} from '@/types/meetup';
import { useMemo } from 'react';
import { PaginatedResponse } from '@/types/api';
import useAxios from '@/hooks/useAxios';

export const useMeetupService = () => {
    const fetchData = useAxios();

    return useMemo(
        () => ({
            getMeetups: async (params?: MeetupPaginationParams): Promise<ApiResponse<PaginatedResponse<Meetup>>> => {
                return await fetchData<PaginatedResponse<Meetup>>({
                    endpoint: '/public/meetups',
                    method: 'GET',
                    params: {
                        page: params?.page?.toString() || '0',
                        size: params?.size?.toString() || '50',
                        type: params?.type || 'upcoming',
                    },
                });
            },

            getMeetupDetails: async (id: number): Promise<ApiResponse<MeetupDetails>> => {
                return await fetchData<MeetupDetails>({
                    endpoint: `/public/meetups/${id}/details`,
                    method: 'GET',
                });
            },

            createMeetup: async (
                meetupData: Omit<Meetup, 'id' | 'availableSeats'>,
                imageFile?: File | null,
            ): Promise<ApiResponse<Meetup>> => {
                const formData = new FormData();

                const fieldsToSend = {
                    title: meetupData.title,
                    description: meetupData.description,
                    parking: meetupData.parking,
                    location: meetupData.location,
                    maxSeats: meetupData.maxSeats,
                    provided: meetupData.provided,
                    meetupDate: meetupData.meetupDate,
                    startTime: meetupData.startTime,
                    endTime: meetupData.endTime,
                };

                Object.entries(fieldsToSend).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, String(value));
                    }
                });

                if (imageFile instanceof File) {
                    formData.append('image', imageFile);
                }

                const accessToken = localStorage.getItem('access_token');

                return await fetchData<Meetup>({
                    endpoint: '/admin/meetups',
                    method: 'POST',
                    data: formData,
                    customHeaders: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            },

            updateMeetup: async (id: number, meetupData: Partial<Meetup>): Promise<ApiResponse<MeetupResponse>> => {
                const accessToken = localStorage.getItem('access_token');
                return await fetchData<MeetupResponse>({
                    endpoint: `/admin/meetups/${id}`,
                    method: 'PUT',
                    data: meetupData,
                    customHeaders: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
            },

            updateMeetupMedia: async (id: number, imageFile: File): Promise<ApiResponse<MeetupResponse>> => {
                const accessToken = localStorage.getItem('access_token');
                const formData = new FormData();
                formData.append('file', imageFile);

                return await fetchData<MeetupResponse>({
                    endpoint: `/admin/meetups/${id}/media`,
                    method: 'PUT',
                    data: formData,
                    customHeaders: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            },

            deleteMeetup: async (id: number): Promise<ApiResponse<string>> => {
                return await fetchData<string>({
                    endpoint: `/admin/meetups/${id}`,
                    method: 'DELETE',
                });
            },

            addSpeaker: async (meetupId: number, speakerData: SpeakerFormData): Promise<ApiResponse<Speaker>> => {
                const formData = new FormData();

                Object.entries(speakerData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (key === 'image' && value instanceof File) {
                            formData.append(key, value);
                        } else {
                            formData.append(key, String(value));
                        }
                    }
                });

                const accessToken = localStorage.getItem('access_token');

                return await fetchData<Speaker>({
                    endpoint: `/admin/meetups/${meetupId}/speakers`,
                    method: 'POST',
                    data: formData,
                    customHeaders: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            },

            updateSpeaker: async (
                meetupId: number,
                speakerId: number,
                speakerData: Partial<SpeakerFormData>,
            ): Promise<ApiResponse<Speaker>> => {
                return await fetchData<Speaker>({
                    endpoint: `/admin/meetups/${meetupId}/speakers/${speakerId}`,
                    method: 'PUT',
                    data: speakerData,
                });
            },

            deleteSpeaker: async (meetupId: number, speakerId: number): Promise<ApiResponse<string>> => {
                return await fetchData<string>({
                    endpoint: `/admin/meetups/${meetupId}/speakers/${speakerId}`,
                    method: 'DELETE',
                });
            },

            addNote: async (meetupId: number, noteData: NoteFormData): Promise<ApiResponse<Note>> => {
                return await fetchData<Note>({
                    endpoint: `/admin/meetups/${meetupId}/notes`,
                    method: 'POST',
                    data: noteData,
                });
            },

            deleteNote: async (meetupId: number, noteId: number): Promise<ApiResponse<string>> => {
                return await fetchData<string>({
                    endpoint: `/admin/meetups/${meetupId}/notes/${noteId}`,
                    method: 'DELETE',
                });
            },

            addKeynote: async (meetupId: number, keynoteData: KeynoteFormData): Promise<ApiResponse<Keynote>> => {
                const formData = new FormData();

                Object.entries(keynoteData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (key === 'file' && value instanceof File) {
                            formData.append(key, value);
                        } else {
                            formData.append(key, String(value));
                        }
                    }
                });

                return await fetchData<Keynote>({
                    endpoint: `/admin/meetups/${meetupId}/keynotes`,
                    method: 'POST',
                    data: formData,
                });
            },

            deleteKeynote: async (meetupId: number, keynoteId: number): Promise<ApiResponse<string>> => {
                return await fetchData<string>({
                    endpoint: `/admin/meetups/${meetupId}/keynotes/${keynoteId}`,
                    method: 'DELETE',
                });
            },
        }),
        [fetchData],
    );
};
