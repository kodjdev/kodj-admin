'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Meetup, MeetupFormData } from '@/types/meetup';
import { Form, FormGroup, FormRow, Label, Input, Textarea, Checkbox, FileInputLabel } from '@/components/common/Form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

type MeetupFormProps = {
    meetupId?: string;
    onSubmit?: (formData: Meetup, imageFile?: File | null) => Promise<void>;
    initialData?: MeetupFormData;
    onImageUpdate?: (imageFile: File) => Promise<void>;
};

const FormActions = styled.div`
    display: flex;
    gap: ${themeColors.spacing.md};
    justify-content: flex-end;
    margin-top: ${themeColors.spacing.xl};
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

export default function MeetupForm({ meetupId, initialData, onSubmit, onImageUpdate }: MeetupFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<Meetup>({
        title: '',
        description: '',
        parking: false,
        location: '',
        maxSeats: 1,
        provided: '',
        meetupDate: '',
        startTime: '',
        endTime: '',
        image: '',
    });
    const [imageFile, setImageFile] = useState<{ name: string; preview?: string } | null>(null);
    const [isUpdatingImage, setIsUpdatingImage] = useState(false);

    useEffect(() => {
        if (!initialData || !initialData.title) return;

        console.log('InitialData in MeetupForm:', initialData);

        const formatToDateTimeLocal = (value?: string) => {
            if (!value || typeof value !== 'string') return '';
            return value.replace(' ', 'T').slice(0, 16);
        };

        setFormData({
            title: initialData.title || '',
            description: initialData.description || '',
            parking: initialData.parking || false,
            location: initialData.location || '',
            maxSeats: initialData.maxSeats || 1,
            provided: initialData.provided || '',
            meetupDate: initialData.meetupDate || '',
            startTime: formatToDateTimeLocal(initialData.startTime),
            endTime: formatToDateTimeLocal(initialData.endTime),
            image: initialData.imageName || '',
        });

        if (initialData.imageName && initialData.imageURL) {
            setImageFile({
                name: initialData.imageName,
                preview: initialData.imageURL,
            } as any);
        }
    }, [initialData]);

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

    const handleImageUpdate = async () => {
        if (!onImageUpdate || !imageFile || !(imageFile as any)?.file) {
            console.error('No image file selected or onImageUpdate not provided');
            return;
        }

        const file = (imageFile as any).file;
        console.log('Updating image with file:', file);

        setIsUpdatingImage(true);
        try {
            await onImageUpdate(file);
        } catch (error) {
            console.error('Failed to update image:', error);
        } finally {
            setIsUpdatingImage(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log('Selected file:', file);
            setImageFile({
                name: file.name,
                preview: URL.createObjectURL(file),
                file,
            } as any);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            await onSubmit(formData, (imageFile as any)?.file ?? null);
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

                        {imageFile && (
                            <div style={{ marginTop: '8px', color: '#b3b3b3' }}>
                                <div>{imageFile.name}</div>
                                {imageFile.preview && (
                                    <img
                                        src={imageFile.preview}
                                        alt="Selected"
                                        style={{ marginTop: '6px', height: '100px', borderRadius: '8px' }}
                                    />
                                )}
                                {meetupId && onImageUpdate && imageFile && (imageFile as any)?.file instanceof File && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleImageUpdate}
                                        disabled={isUpdatingImage}
                                        style={{ marginTop: '8px' }}
                                    >
                                        {isUpdatingImage ? 'Updating...' : 'Update Image'}
                                    </Button>
                                )}
                            </div>
                        )}
                    </FormGroup>

                    <FormActions>
                        <Button type="button" variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {meetupId ? 'Update Meetup' : 'Create Meetup'}
                        </Button>
                    </FormActions>
                </Form>
            </CardContent>
        </Card>
    );
}
