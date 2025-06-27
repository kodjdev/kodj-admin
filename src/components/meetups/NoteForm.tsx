'use client';

import React, { useState } from 'react';
import { NoteFormData } from '@/types/meetup';
import { Form, FormGroup, Label, Input, Textarea, Select } from '@/components/common/Form';
import { Button } from '@/components/common/Button';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

type NoteFormProps = {
    onClose: () => void;
    onSubmit: (data: NoteFormData) => void;
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

export default function NoteForm({ onClose, onSubmit }: NoteFormProps) {
    const [formData, setFormData] = useState<NoteFormData>({
        title: '',
        description: '',
        status: 'ACTIVE',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
                    <ModalTitle>Add Note</ModalTitle>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </ModalHeader>

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <DarkLabel htmlFor="title">Title *</DarkLabel>
                        <DarkInput
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Note title"
                        />
                    </FormGroup>

                    <FormGroup>
                        <DarkLabel htmlFor="description">Description *</DarkLabel>
                        <DarkTextarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Note description"
                            rows={4}
                        />
                    </FormGroup>

                    <FormGroup>
                        <DarkLabel htmlFor="status">Status</DarkLabel>
                        <DarkSelect id="status" name="status" value={formData.status} onChange={handleChange}>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </DarkSelect>
                    </FormGroup>

                    <FormActions>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Add Note
                        </Button>
                    </FormActions>
                </Form>
            </ModalContent>
        </Modal>
    );
}
