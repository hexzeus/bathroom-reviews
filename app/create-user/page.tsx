"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CreateUserPage.module.css';

export default function CreateUserPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            const user = await response.json();
            console.log('User created:', user);
            router.push(`/review?userId=${user.id}`);
        } catch (error) {
            console.error('Error creating user:', error);
            setError('Failed to create user. Please try again.');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={styles.title}>Create New User</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <input
                    type="text"
                    placeholder="Name"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className={styles.button}>
                    Create User
                </button>
            </form>
        </div>
    );
}
