import { ApiResponse, PaginationParams } from '@/types/common';
import {
    Meetup,
    MeetupFormData,
    Speaker,
    SpeakerFormData,
    Note,
    NoteFormData,
    Keynote,
    KeynoteFormData,
    MeetupPaginationParams,
    MeetupDetailsResponse,
    MeetupResponse,
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
                    params,
                });
            },

            getMeetupDetails: async (id: number): Promise<ApiResponse<MeetupDetailsResponse>> => {
                return await fetchData<MeetupDetailsResponse>({
                    endpoint: `/public/meetups/${id}/details`,
                    method: 'GET',
                });
            },

            createMeetup: async (meetupData: MeetupFormData): Promise<ApiResponse<Meetup>> => {
                const formData = new FormData();

                Object.entries(meetupData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (key === 'image' && value instanceof File) {
                            formData.append(key, value);
                        } else {
                            formData.append(key, String(value));
                        }
                    }
                });

                return await fetchData<Meetup>({
                    endpoint: '/meetups',
                    method: 'POST',
                    data: formData,
                    customHeaders: {
                        'Content-Type': 'multipart/form-data',
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

            deleteMeetup: async (id: number): Promise<ApiResponse<string>> => {
                return await fetchData<string>({
                    endpoint: `/meetups/${id}`,
                    method: 'DELETE',
                });
            },

            // Speaker endpoints
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

                return await fetchData<Speaker>({
                    endpoint: `/meetups/${meetupId}/speakers`,
                    method: 'POST',
                    data: formData,
                    customHeaders: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            },

            updateSpeaker: async (
                meetupId: number,
                speakerId: number,
                speakerData: Partial<SpeakerFormData>,
            ): Promise<ApiResponse<Speaker>> => {
                return await fetchData<Speaker>({
                    endpoint: `/meetups/${meetupId}/speakers/${speakerId}`,
                    method: 'PUT',
                    data: speakerData,
                });
            },

            deleteSpeaker: async (meetupId: number, speakerId: number): Promise<ApiResponse<string>> => {
                return await fetchData<string>({
                    endpoint: `/meetups/${meetupId}/speakers/${speakerId}`,
                    method: 'DELETE',
                });
            },

            // Note endpoints
            addNote: async (meetupId: number, noteData: NoteFormData): Promise<ApiResponse<Note>> => {
                return await fetchData<Note>({
                    endpoint: `/meetups/${meetupId}/notes`,
                    method: 'POST',
                    data: noteData,
                });
            },

            deleteNote: async (meetupId: number, noteId: number): Promise<ApiResponse<string>> => {
                return await fetchData<string>({
                    endpoint: `/meetups/${meetupId}/notes/${noteId}`,
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
                    endpoint: `/meetups/${meetupId}/keynotes`,
                    method: 'POST',
                    data: formData,
                    customHeaders: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            },

            deleteKeynote: async (meetupId: number, keynoteId: number): Promise<ApiResponse<string>> => {
                return await fetchData<string>({
                    endpoint: `/meetups/${meetupId}/keynotes/${keynoteId}`,
                    method: 'DELETE',
                });
            },
        }),
        [fetchData],
    );
};
