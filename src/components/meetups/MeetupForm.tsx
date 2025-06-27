'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMeetupService } from '@/services/api/meetupService';
import { MeetupFormData } from '@/types/meetup';
import { Form, FormGroup, FormRow, Label, Input, Textarea, Checkbox } from '@/components/common/Form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

const FormActions = styled.div`
    display: flex;
    gap: ${themeColors.spacing.md};
    justify-content: flex-end;
    margin-top: ${themeColors.spacing.xl};
`;

const FileInputLabel = styled.label`
    display: inline-block;
    padding: ${themeColors.spacing.sm} ${themeColors.spacing.md};
    background-color: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: ${themeColors.cardBorder.md};
    cursor: pointer;
    transition: all ${themeColors.transitions.normal};
    color: #ffffff;

    &:hover {
        background-color: #3a3a3a;
    }
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: ${themeColors.spacing.sm};
    color: #b3b3b3;
`;

type MeetupFormProps = {
    meetupId?: string;
};

export default function MeetupForm({ meetupId }: MeetupFormProps) {
    const router = useRouter();
    const { createMeetup, updateMeetup, getMeetupDetails, loading } = useMeetupService();
    const [formData, setFormData] = useState<MeetupFormData>({
        title: '',
        description: '',
        parking: false,
        location: '',
        maxSeats: 50,
        provided: '',
        meetupDate: '',
        startTime: '',
        endTime: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (meetupId) {
            fetchMeetupDetails();
        }
    }, [meetupId]);

    const fetchMeetupDetails = async () => {
        try {
            const response = await getMeetupDetails(Number(meetupId));
            const meetup = response.data;
            setFormData({
                title: meetup.title,
                description: meetup.description,
                parking: meetup.parking,
                location: meetup.location,
                maxSeats: meetup.maxSeats,
                provided: meetup.provided,
                meetupDate: meetup.meetupDate,
                startTime: meetup.startTime,
                endTime: meetup.endTime,
            });
        } catch (err) {
            console.error('Failed to fetch meetup details:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData((prev) => ({
                ...prev,
                [name]: target.checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'number' ? parseInt(value) : value,
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const submitData = {
                ...formData,
                image: imageFile || undefined,
            };

            if (meetupId) {
                await updateMeetup(Number(meetupId), submitData);
            } else {
                await createMeetup(submitData);
            }

            router.push('/meetups');
        } catch (err) {
            console.error('Failed to save meetup:', err);
        }
    };

    const handleCancel = () => {
        router.push('/meetups');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{meetupId ? 'Edit Meetup' : 'Create Meetup'}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter meetup title"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter meetup description"
                            rows={4}
                        />
                    </FormGroup>

                    <FormRow>
                        <FormGroup>
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="Enter venue location"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="maxSeats">Max Seats *</Label>
                            <Input
                                id="maxSeats"
                                name="maxSeats"
                                type="number"
                                value={formData.maxSeats}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </FormGroup>
                    </FormRow>

                    <FormRow>
                        <FormGroup>
                            <Label htmlFor="meetupDate">Meetup Date *</Label>
                            <Input
                                id="meetupDate"
                                name="meetupDate"
                                type="date"
                                value={formData.meetupDate}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="startTime">Start Time *</Label>
                            <Input
                                id="startTime"
                                name="startTime"
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="endTime">End Time *</Label>
                            <Input
                                id="endTime"
                                name="endTime"
                                type="datetime-local"
                                value={formData.endTime}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                    </FormRow>

                    <FormGroup>
                        <Label htmlFor="provided">What's Provided</Label>
                        <Textarea
                            id="provided"
                            name="provided"
                            value={formData.provided}
                            onChange={handleChange}
                            placeholder="e.g., Refreshments, WiFi, Parking"
                            rows={2}
                        />
                    </FormGroup>

                    <FormGroup>
                        <CheckboxWrapper>
                            <Checkbox id="parking" name="parking" checked={formData.parking} onChange={handleChange} />
                            <Label htmlFor="parking">Parking Available</Label>
                        </CheckboxWrapper>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="image">Event Image</Label>
                        <FileInputLabel>
                            Choose Image
                            <HiddenFileInput id="image" type="file" accept="image/*" onChange={handleFileChange} />
                        </FileInputLabel>
                        {imageFile && <span style={{ color: '#b3b3b3', marginLeft: '10px' }}>{imageFile.name}</span>}
                    </FormGroup>

                    <FormActions>
                        <Button type="button" variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </FormActions>
                </Form>
            </CardContent>
        </Card>
    );
}
