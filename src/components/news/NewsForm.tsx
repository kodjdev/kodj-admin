import React, { useState, useEffect } from 'react';
import { NewsFormData } from '@/types/news';
import { Form, FormGroup, FormRow, Label, Input, Textarea, Select, FileInputLabel } from '@/components/common/Form';
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

const HiddenFileInput = styled.input`
    display: none;
`;

type NewsFormProps = {
    initialData?: NewsFormData;
    loading?: boolean;
    error?: string | null;
    onSubmit: (formData: NewsFormData) => Promise<void>;
    onCancel: () => void;
    isEdit?: boolean;
};

export default function NewsForm({
    initialData,
    loading = false,
    error = null,
    onSubmit,
    onCancel,
    isEdit = false,
}: NewsFormProps) {
    const [formData, setFormData] = useState<NewsFormData>({
        title: '',
        content: '',
        type: 'GENERAL',
        contactPhone: '',
        contactEmail: '',
        twitterProfile: '',
        linkedinProfile: '',
        facebookProfile: '',
        instagramHandle: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Populate form with initial data
    console.log('Initial Data:', initialData);
    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id,
                userId: initialData.userId,
                title: initialData.title || '',
                content: initialData.content || '',
                type: initialData.type || 'GENERAL',
                contactPhone: initialData.contactPhone || '',
                contactEmail: initialData.contactEmail || '',
                twitterProfile: initialData.twitterProfile || '',
                linkedinProfile: initialData.linkedinProfile || '',
                facebookProfile: initialData.facebookProfile || '',
                instagramHandle: initialData.instagramHandle || '',
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = {
            ...formData,
            imageFile: imageFile || undefined,
        };

        await onSubmit(submitData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEdit ? 'Edit News' : 'Create News'}</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div
                        style={{
                            background: '#ff4444',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                        }}
                    >
                        {error}
                    </div>
                )}

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter news title"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="type">Type *</Label>
                        <Select id="type" name="type" value={formData.type} onChange={handleChange} required>
                            <option value="GENERAL">General</option>
                            <option value="TECH">Tech</option>
                            <option value="BUSINESS">Business</option>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            placeholder="Enter news content"
                            rows={6}
                        />
                    </FormGroup>

                    <FormRow>
                        <FormGroup>
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <Input
                                id="contactEmail"
                                name="contactEmail"
                                type="email"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                placeholder="contact@example.com"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <Input
                                id="contactPhone"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="+1234567890"
                            />
                        </FormGroup>
                    </FormRow>

                    <FormRow>
                        <FormGroup>
                            <Label htmlFor="twitterProfile">Twitter Profile</Label>
                            <Input
                                id="twitterProfile"
                                name="twitterProfile"
                                value={formData.twitterProfile}
                                onChange={handleChange}
                                placeholder="@username"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
                            <Input
                                id="linkedinProfile"
                                name="linkedinProfile"
                                value={formData.linkedinProfile}
                                onChange={handleChange}
                                placeholder="linkedin.com/in/username"
                            />
                        </FormGroup>
                    </FormRow>

                    <FormRow>
                        <FormGroup>
                            <Label htmlFor="facebookProfile">Facebook Profile</Label>
                            <Input
                                id="facebookProfile"
                                name="facebookProfile"
                                value={formData.facebookProfile}
                                onChange={handleChange}
                                placeholder="facebook.com/username"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="instagramHandle">Instagram Handle</Label>
                            <Input
                                id="instagramHandle"
                                name="instagramHandle"
                                value={formData.instagramHandle}
                                onChange={handleChange}
                                placeholder="@username"
                            />
                        </FormGroup>
                    </FormRow>

                    <FormGroup>
                        <Label htmlFor="image">Image</Label>
                        <FileInputLabel>
                            Choose Image
                            <HiddenFileInput id="image" type="file" accept="image/*" onChange={handleFileChange} />
                        </FileInputLabel>
                        {imageFile && <span>{imageFile.name}</span>}
                    </FormGroup>

                    <FormActions>
                        <Button type="button" variant="secondary" onClick={onCancel}>
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
