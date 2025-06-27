'use client';

import React, { useState } from 'react';
import { KeynoteFormData } from '@/types/meetup';
import { Form, FormGroup, FormRow, Label, Input, Select } from '@/components/common/Form';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';
import { Button } from '@/components/common/Button';

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
    max-width: 500px;
    width: 90%;
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
`;

const DarkSelect = styled(Select)`
    background-color: #0a0a0a;
    border-color: #2a2a2a;
    color: #ffffff;

    &:focus {
        border-color: #4f46e5;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }
`;

const FormActions = styled.div`
    display: flex;
    gap: ${themeColors.spacing.md};
    justify-content: flex-end;
    margin-top: ${themeColors.spacing.xl};
`;

interface KeynoteFormProps {
    speakers: Array<{ id: number; firstName: string; lastName: string }>;
    onClose: () => void;
    onSubmit: (data: KeynoteFormData) => void;
}

export const KeynoteForm: React.FC<KeynoteFormProps> = ({ speakers, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<KeynoteFormData>({
        speakerId: 0,
        subject: '',
        startTime: '',
        endTime: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'speakerId' ? parseInt(value) : value,
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
                    <ModalTitle>Add Keynote</ModalTitle>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </ModalHeader>

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <DarkLabel htmlFor="speakerId">Speaker *</DarkLabel>
                        <DarkSelect
                            id="speakerId"
                            name="speakerId"
                            value={formData.speakerId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a speaker</option>
                            {speakers.map((speaker) => (
                                <option key={speaker.id} value={speaker.id}>
                                    {speaker.firstName} {speaker.lastName}
                                </option>
                            ))}
                        </DarkSelect>
                    </FormGroup>

                    <FormGroup>
                        <DarkLabel htmlFor="subject">Subject *</DarkLabel>
                        <DarkInput
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="Keynote subject"
                        />
                    </FormGroup>

                    <FormRow>
                        <FormGroup>
                            <DarkLabel htmlFor="startTime">Start Time *</DarkLabel>
                            <DarkInput
                                id="startTime"
                                name="startTime"
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                                placeholder="Start time"
                            />
                        </FormGroup>
                        <FormGroup>
                            <DarkLabel htmlFor="endTime">End Time *</DarkLabel>
                            <DarkInput
                                id="endTime"
                                name="endTime"
                                type="datetime-local"
                                value={formData.endTime}
                                onChange={handleChange}
                                required
                                placeholder="End time"
                            />
                        </FormGroup>
                    </FormRow>
                    <FormActions>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Add Keynote
                        </Button>
                    </FormActions>
                </Form>
            </ModalContent>
        </Modal>
    );
};
