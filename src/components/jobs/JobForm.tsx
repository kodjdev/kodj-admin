import React, { useState, useEffect } from 'react';
import { JobFormData, JobPost } from '@/types/job';
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

type JobFormProps = {
    initialData?: JobPost | null;
    onSubmit: (formData: JobFormData) => Promise<void>;
    onCancel: () => void;
    loading: boolean;
    mode: 'create' | 'edit';
};

const FormActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${themeColors.spacing.md};
    margin-top: ${themeColors.spacing.xl};
`;

const HiddenFileInput = styled.input`
    display: none;
`;

export default function JobForm({ initialData, onSubmit, onCancel, loading, mode }: JobFormProps) {
    const [formData, setFormData] = useState<JobFormData>({
        title: '',
        companyName: '',
        requiredExperience: '',
        jobType: 'FULL_TIME',
        jobOfferStatus: 'OPEN',
        remote: false,
        category: '',
    });

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({
                title: initialData.title || '',
                companyName: initialData.companyName || '',
                requiredExperience: initialData.requiredExperience || '',
                jobType: initialData.jobType || 'FULL_TIME',
                jobOfferStatus: initialData.jobOfferStatus || 'OPEN',
                remote: initialData.remote || false,
                technologies: initialData.technologies || '',
                content: initialData.content || '',
                placeOfWork: initialData.placeOfWork || '',
                salaryRange: initialData.salaryRange || '',
                contactPhone: initialData.contactPhone || '',
                contactEmail: initialData.contactEmail || '',
                linkedinProfile: initialData.linkedinProfile || '',
                twitterProfile: initialData.twitterProfile || '',
                facebookProfile: initialData.facebookProfile || '',
                instagramProfile: initialData.instagramProfile || '',
            });
        }
    }, [initialData, mode]);

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
        await onSubmit(formData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{mode === 'create' ? 'Create New Job' : 'Edit Job'}</CardTitle>
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
                            disabled={loading}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Category</Label>
                        <Input
                            name="category"
                            value={formData.category || ''}
                            onChange={handleChange}
                            placeholder="Job Category"
                            disabled={loading}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Company Name</Label>
                        <Input
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </FormGroup>

                    <FormRow>
                        <FormGroup>
                            <Label>Experience Required</Label>
                            <Input
                                name="requiredExperience"
                                value={formData.requiredExperience}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Job Type</Label>
                            <Select name="jobType" value={formData.jobType} onChange={handleChange} disabled={loading}>
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label>Status</Label>
                            <Select
                                name="jobOfferStatus"
                                value={formData.jobOfferStatus}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="OPEN">Open</option>
                                <option value="CLOSED">Closed</option>
                            </Select>
                        </FormGroup>
                    </FormRow>

                    <FormGroup>
                        <Label>Technologies</Label>
                        <Input
                            name="technologies"
                            value={formData.technologies || ''}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Job Description</Label>
                        <Textarea
                            name="content"
                            value={formData.content || ''}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </FormGroup>

                    <FormRow>
                        <FormGroup>
                            <Label>Remote</Label>
                            <Checkbox
                                name="remote"
                                checked={formData.remote}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Place of Work</Label>
                            <Input
                                name="placeOfWork"
                                value={formData.placeOfWork || ''}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Salary Range</Label>
                            <Input
                                name="salaryRange"
                                value={formData.salaryRange || ''}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </FormGroup>
                    </FormRow>

                    <FormRow>
                        <FormGroup>
                            <Label>Contact Phone</Label>
                            <Input
                                name="contactPhone"
                                value={formData.contactPhone || ''}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Contact Email</Label>
                            <Input
                                name="contactEmail"
                                type="email"
                                value={formData.contactEmail || ''}
                                onChange={handleChange}
                                disabled={loading}
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
                                disabled={loading}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Twitter</Label>
                            <Input
                                name="twitterProfile"
                                value={formData.twitterProfile || ''}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Facebook</Label>
                            <Input
                                name="facebookProfile"
                                value={formData.facebookProfile || ''}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Instagram</Label>
                            <Input
                                name="instagramProfile"
                                value={formData.instagramProfile || ''}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </FormGroup>
                    </FormRow>

                    <FormGroup>
                        <Label>Thumbnail</Label>
                        <FileInputLabel htmlFor="image-upload">Upload Image</FileInputLabel>
                        <HiddenFileInput
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                        {formData.image && <span>{formData.image.name}</span>}
                    </FormGroup>

                    <FormActions>
                        <Button type="submit" disabled={loading}>
                            {mode === 'create' ? 'Create Job' : 'Update Job'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
                            Cancel
                        </Button>
                    </FormActions>
                </Form>
            </CardContent>
        </Card>
    );
}
