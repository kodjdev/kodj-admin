'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Button } from '@/components/common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Input, Textarea, Checkbox, Label, FileInputLabel, Form } from '@/components/common/Form';
import { themeColors } from '@/themes/themeColors';
import { Meetup } from '@/types/meetup';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, TimePicker } from 'antd';

type ImageFileState = {
    name: string;
    preview?: string;
    file?: File;
};

export type MeetupFormProps = {
    meetupId?: number;
    initialData?: Meetup;
    onSubmit: (formData: Omit<Meetup, 'id' | 'availableSeats'>, imageFile: File | null) => Promise<void>;
    onImageUpdate?: (imageFile: File) => Promise<void>;
};

type InternalMeetupFormData = Omit<Meetup, 'id' | 'availableSeats' | 'startTime' | 'endTime' | 'meetupDate'> & {
    startTime: Dayjs | null;
    endTime: Dayjs | null;
    meetupDate: Dayjs | null;
};

const FormGroup = styled.div`
    margin-bottom: ${themeColors.spacing.md};
    display: flex;
    flex-direction: column;
    gap: ${themeColors.spacing.xs};
`;

const FormRow = styled.div`
    display: flex;
    gap: ${themeColors.spacing.lg};
    margin-bottom: ${themeColors.spacing.md};
    align-items: flex-start;

    > ${FormGroup} {
        flex: 1;
        margin-bottom: 0;
    }

    &.two-column > ${FormGroup} {
        flex-basis: calc(50% - (${themeColors.spacing.lg} / 2));
    }

    &.three-column > ${FormGroup} {
        flex-basis: calc(33.333% - (2 * ${themeColors.spacing.lg} / 3));
    }
`;

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: ${themeColors.spacing.sm};
`;

const FormActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${themeColors.spacing.md};
    margin-top: ${themeColors.spacing.xl};
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const ImagePreviewContainer = styled.div`
    margin-top: ${themeColors.spacing.md};
    color: ${themeColors.dark.textSecondary};
    display: flex;
    flex-direction: column;
    gap: ${themeColors.spacing.sm};
    align-items: flex-start;

    img {
        max-width: 200px;
        height: auto;
        border-radius: ${themeColors.cardBorder.md};
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
`;

export default function MeetupForm({ meetupId, initialData, onSubmit, onImageUpdate }: MeetupFormProps) {
    const router = useRouter();

    const [formData, setFormData] = useState<InternalMeetupFormData>({
        title: '',
        description: '',
        parking: false,
        location: '',
        maxSeats: 1,
        provided: '',
        meetupDate: null,
        startTime: null,
        endTime: null,
        image: '',
    });

    const [imageFile, setImageFile] = useState<ImageFileState | null>(null);
    const [isUpdatingImage, setIsUpdatingImage] = useState(false);

    useEffect(() => {
        if (!initialData) {
            setFormData({
                title: '',
                description: '',
                parking: false,
                location: '',
                maxSeats: 1,
                provided: '',
                meetupDate: null,
                startTime: null,
                endTime: null,
                image: '',
            });
            setImageFile(null);
            return;
        }

        setFormData({
            title: initialData.title || '',
            description: initialData.description || '',
            parking: initialData.parking || false,
            location: initialData.location || '',
            maxSeats: initialData.maxSeats || 1,
            provided: initialData.provided || '',
            meetupDate: initialData.meetupDate ? dayjs(initialData.meetupDate) : null,
            startTime: initialData.startTime ? dayjs(initialData.startTime) : null,
            endTime: initialData.endTime ? dayjs(initialData.endTime) : null,
            image: initialData.imageName || '',
        });

        if (initialData.imageName && initialData.imageURL) {
            setImageFile({
                name: initialData.imageName,
                preview: initialData.imageURL,
            });
        } else {
            setImageFile(null);
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
        if (!onImageUpdate || !imageFile || !(imageFile.file instanceof File)) {
            return;
        }

        const file = imageFile.file;

        setIsUpdatingImage(true);
        try {
            await onImageUpdate(file);
            setImageFile((prev) => (prev ? { name: prev.name, preview: prev.preview } : null));
        } catch (error) {
            console.error('Failed to update image:', error);
        } finally {
            setIsUpdatingImage(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile({
                name: file.name,
                preview: URL.createObjectURL(file),
                file,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (onSubmit) {
            const meetupDateStr = formData.meetupDate ? formData.meetupDate.format('YYYY-MM-DD') : '';
            const startTimeStr = formData.startTime ? formData.startTime.format('HH:mm:ss') : '';
            const endTimeStr = formData.endTime ? formData.endTime.format('HH:mm:ss') : '';

            const submittedFormData: Omit<Meetup, 'id' | 'availableSeats'> = {
                title: formData.title,
                description: formData.description,
                parking: formData.parking,
                location: formData.location,
                maxSeats: formData.maxSeats,
                provided: formData.provided,
                meetupDate: meetupDateStr,
                startTime: `${meetupDateStr} ${startTimeStr}`,
                endTime: `${meetupDateStr} ${endTimeStr}`,
                image: formData.image,
            };

            await onSubmit(submittedFormData, imageFile?.file ?? null);
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

                    <FormRow className="two-column">
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

                    <FormRow className="three-column">
                        <FormGroup>
                            <Label htmlFor="meetupDate">Meetup Date *</Label>
                            <DatePicker
                                id="meetupDate"
                                value={formData.meetupDate}
                                onChange={(date) => setFormData((prev) => ({ ...prev, meetupDate: date }))}
                                format="YYYY-MM-DD"
                                style={{
                                    width: '100%',
                                    backgroundColor: themeColors.dark.background,
                                    color: themeColors.colors.success.light,
                                    fontSize: themeColors.typography.body.small.fontSize,
                                    borderRadius: themeColors.cardBorder.md,
                                    borderColor: themeColors.colors.success.light + '50',
                                }}
                                placeholder="Select meetup date"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="startTime">Start Time *</Label>
                            <TimePicker
                                id="startTime"
                                value={formData.startTime}
                                onChange={(time) => setFormData((prev) => ({ ...prev, startTime: time }))}
                                format="HH:mm"
                                style={{
                                    width: '100%',
                                    backgroundColor: themeColors.dark.background,
                                    color: themeColors.colors.success.light,
                                    fontSize: themeColors.typography.body.small.fontSize,
                                    borderRadius: themeColors.cardBorder.md,
                                    borderColor: themeColors.colors.success.light + '50',
                                }}
                                placeholder="Select start time"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="endTime">End Time *</Label>
                            <TimePicker
                                id="endTime"
                                value={formData.endTime}
                                onChange={(time) => setFormData((prev) => ({ ...prev, endTime: time }))}
                                format="HH:mm"
                                style={{
                                    width: '100%',
                                    backgroundColor: themeColors.dark.background,
                                    color: themeColors.colors.success.light,
                                    fontSize: themeColors.typography.body.small.fontSize,
                                    borderRadius: themeColors.cardBorder.md,
                                    borderColor: themeColors.colors.success.light + '50',
                                }}
                                placeholder="Select end time"
                            />
                        </FormGroup>
                    </FormRow>

                    <FormGroup>
                        <Label htmlFor="provided">What is Provided</Label>
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

                        {imageFile && (imageFile.name || imageFile.preview) && (
                            <ImagePreviewContainer>
                                {imageFile.name && <div>{imageFile.name}</div>}
                                {imageFile.preview && <img src={imageFile.preview} alt="Selected" />}
                                {meetupId && onImageUpdate && imageFile.file instanceof File && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleImageUpdate}
                                        disabled={isUpdatingImage}
                                        style={{ marginTop: themeColors.spacing.sm }}
                                    >
                                        {isUpdatingImage ? 'Updating...' : 'Update Image'}
                                    </Button>
                                )}
                            </ImagePreviewContainer>
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
