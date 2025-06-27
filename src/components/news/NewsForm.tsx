import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNewsService } from '@/services/api/newsService';
import { NewsFormData } from '@/types/news';
import { Form, FormGroup, FormRow, Label, Input, Textarea, Select, ErrorMessage } from '@/components/common/Form';
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
    background-color: ${themeColors.colors.neutral.gray100};
    border: 1px solid ${themeColors.cardBorder.color};
    border-radius: ${themeColors.cardBorder.md};
    cursor: pointer;
    transition: all ${themeColors.transitions.normal};

    &:hover {
        background-color: ${themeColors.colors.neutral.gray200};
    }
`;

const HiddenFileInput = styled.input`
    display: none;
`;

type NewsFormProps = {
    newsId?: string;
};

export default function NewsForm({ newsId }: NewsFormProps) {
    const router = useRouter();
    const { createNews, updateNews, getNewsById, loading, error } = useNewsService();
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

    useEffect(() => {
        if (newsId) {
            fetchNewsDetails();
        }
    }, [newsId]);

    const fetchNewsDetails = async () => {
        try {
            const response = await getNewsById(Number(newsId));
            const news = response.data;
            setFormData({
                title: news.title,
                content: news.content,
                type: news.type,
                contactPhone: news.contactPhone || '',
                contactEmail: news.contactEmail || '',
                twitterProfile: news.twitterProfile || '',
                linkedinProfile: news.linkedinProfile || '',
                facebookProfile: news.facebookProfile || '',
                instagramHandle: news.instagramHandle || '',
            });
        } catch (err) {
            console.error('Failed to fetch news details:', err);
        }
    };

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

        try {
            const submitData = {
                ...formData,
                imageFile: imageFile || undefined,
            };

            if (newsId) {
                await updateNews(Number(newsId), submitData);
            } else {
                await createNews(submitData);
            }

            router.push('/news');
        } catch (err) {
            console.error('Failed to save news:', err);
        }
    };

    const handleCancel = () => {
        router.push('/news');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{newsId ? 'Edit News' : 'Create News'}</CardTitle>
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
