'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJobService } from '@/services/api/jobService';
import { JobFormData } from '@/types/job';
import {
    Form,
    FormGroup,
    FormRow,
    Label,
    Input,
    Textarea,
    Select,
    Checkbox,
    FileInputLabel,
} from '@/components/common/Form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

const FormActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${themeColors.spacing.md};
    margin-top: ${themeColors.spacing.xl};
`;

const HiddenFileInput = styled.input`
    display: none;
`;

export default function JobForm() {
    const router = useRouter();
    const { createJobPost } = useJobService();

    const [formData, setFormData] = useState<JobFormData>({
        title: '',
        companyName: '',
        requiredExperience: '',
        jobType: 'FULL_TIME',
        jobOfferStatus: 'OPEN',
        remote: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFormData((prev) => ({
                ...prev,
                image: e.target.files![0],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createJobPost(formData);
            router.push('/jobs');
        } catch (err) {
            console.error('Failed to submit job post:', err);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Job</CardTitle>
            </CardHeader>
            <CardContent>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Title</Label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Job Title"
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Company Name</Label>
                        <Input name="companyName" value={formData.companyName} onChange={handleChange} required />
                    </FormGroup>

                    <FormRow>
                        <FormGroup>
                            <Label>Experience Required</Label>
                            <Input
                                name="requiredExperience"
                                value={formData.requiredExperience}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Job Type</Label>
                            <Select name="jobType" value={formData.jobType} onChange={handleChange}>
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label>Status</Label>
                            <Select name="jobOfferStatus" value={formData.jobOfferStatus} onChange={handleChange}>
                                <option value="OPEN">Open</option>
                                <option value="CLOSED">Closed</option>
                            </Select>
                        </FormGroup>
                    </FormRow>

                    <FormGroup>
                        <Label>Technologies</Label>
                        <Input name="technologies" value={formData.technologies || ''} onChange={handleChange} />
                    </FormGroup>

                    <FormGroup>
                        <Label>Job Description</Label>
                        <Textarea name="content" value={formData.content || ''} onChange={handleChange} />
                    </FormGroup>

                    <FormRow>
                        <FormGroup>
                            <Label>Remote</Label>
                            <Checkbox name="remote" checked={formData.remote} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Place of Work</Label>
                            <Input name="placeOfWork" value={formData.placeOfWork || ''} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Salary Range</Label>
                            <Input name="salaryRange" value={formData.salaryRange || ''} onChange={handleChange} />
                        </FormGroup>
                    </FormRow>

                    <FormRow>
                        <FormGroup>
                            <Label>Contact Phone</Label>
                            <Input name="contactPhone" value={formData.contactPhone || ''} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Contact Email</Label>
                            <Input
                                name="contactEmail"
                                type="email"
                                value={formData.contactEmail || ''}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </FormRow>

                    <FormRow>
                        <FormGroup>
                            <Label>LinkedIn</Label>
                            <Input
                                name="linkedinProfile"
                                value={formData.linkedinProfile || ''}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Twitter</Label>
                            <Input
                                name="twitterProfile"
                                value={formData.twitterProfile || ''}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Facebook</Label>
                            <Input
                                name="facebookProfile"
                                value={formData.facebookProfile || ''}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Instagram</Label>
                            <Input
                                name="instagramProfile"
                                value={formData.instagramProfile || ''}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </FormRow>

                    <FormGroup>
                        <Label>Thumbnail</Label>
                        <FileInputLabel htmlFor="image-upload">Upload Image</FileInputLabel>
                        <HiddenFileInput id="image-upload" type="file" accept="image/*" onChange={handleFileChange} />
                        {formData.image && <span>{formData.image.name}</span>}
                    </FormGroup>

                    <FormActions>
                        <Button type="submit">Submit</Button>
                        <Button type="button" variant="secondary" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </FormActions>
                </Form>
            </CardContent>
        </Card>
    );
}
