'use client';

import React, { useState } from 'react';
import { SpeakerFormData } from '@/types/meetup';
import { Form, FormGroup, FormRow, Label, Input, Textarea } from '@/components/common/Form';
import { Button } from '@/components/common/Button';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

type SpeakerFormProps = {
    onClose: () => void;
    onSubmit: (data: SpeakerFormData) => void;
};

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: ${themeColors.cardBorder.lg};
    padding: ${themeColors.spacing.xl};
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${themeColors.spacing.lg};
`;

const ModalTitle = styled.h2`
    color: #ffffff;
    font-size: ${themeColors.typography.headings.desktop.h4.fontSize}px;
    margin: 0;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: #6a6a6a;
    font-size: 24px;
    cursor: pointer;

    &:hover {
        color: #ffffff;
    }
`;

const DarkLabel = styled(Label)`
    color: #b3b3b3;
`;

const DarkInput = styled(Input)`
    background-color: #0a0a0a;
    border-color: #2a2a2a;
    color: #ffffff;

    &:focus {
        border-color: #4f46e5;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }

    &::placeholder {
        color: #6a6a6a;
    }
`;

const DarkTextarea = styled(Textarea)`
    background-color: #0a0a0a;
    border-color: #2a2a2a;
    color: #ffffff;

    &:focus {
        border-color: #4f46e5;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }

    &::placeholder {
        color: #6a6a6a;
    }
`;

const FormActions = styled.div`
    display: flex;
    gap: ${themeColors.spacing.md};
    justify-content: flex-end;
    margin-top: ${themeColors.spacing.xl};
`;

export default function SpeakerForm({ onClose, onSubmit }: SpeakerFormProps) {
    const [formData, setFormData] = useState<SpeakerFormData>({
        userId: 1, // This should come from user selection
        categoryId: 1, // This should come from category selection
        organization: '',
        position: '',
        bio: '',
        shortDescription: '',
        experience: '',
        topic: '',
        linkedinUrl: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Add Speaker</ModalTitle>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </ModalHeader>

                <Form onSubmit={handleSubmit}>
                    <FormRow>
                        <FormGroup>
                            <DarkLabel htmlFor="organization">Organization *</DarkLabel>
                            <DarkInput
                                id="organization"
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                required
                                placeholder="Company/Organization name"
                            />
                        </FormGroup>

                        <FormGroup>
                            <DarkLabel htmlFor="position">Position *</DarkLabel>
                            <DarkInput
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                placeholder="Job title"
                            />
                        </FormGroup>
                    </FormRow>

                    <FormGroup>
                        <DarkLabel htmlFor="topic">Topic *</DarkLabel>
                        <DarkInput
                            id="topic"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            required
                            placeholder="Speaking topic"
                        />
                    </FormGroup>

                    <FormGroup>
                        <DarkLabel htmlFor="shortDescription">Short Description *</DarkLabel>
                        <DarkTextarea
                            id="shortDescription"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            required
                            placeholder="Brief description of the talk"
                            rows={2}
                        />
                    </FormGroup>

                    <FormGroup>
                        <DarkLabel htmlFor="bio">Bio *</DarkLabel>
                        <DarkTextarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            required
                            placeholder="Speaker biography"
                            rows={3}
                        />
                    </FormGroup>

                    <FormGroup>
                        <DarkLabel htmlFor="experience">Experience</DarkLabel>
                        <DarkTextarea
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="Relevant experience"
                            rows={2}
                        />
                    </FormGroup>

                    <FormGroup>
                        <DarkLabel htmlFor="linkedinUrl">LinkedIn URL</DarkLabel>
                        <DarkInput
                            id="linkedinUrl"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/username"
                        />
                    </FormGroup>

                    <FormActions>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Add Speaker
                        </Button>
                    </FormActions>
                </Form>
            </ModalContent>
        </Modal>
    );
}
