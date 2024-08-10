"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import styles from './ReviewPage.module.css';

const ReviewForm = () => {
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [placeName, setPlaceName] = useState(''); // New state for place name
    const [photo, setPhoto] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [reviews, setReviews] = useState<any[]>([]);
    const searchParams = useSearchParams();

    useEffect(() => {
        const userIdParam = searchParams.get('userId');
        if (userIdParam) {
            setUserId(parseInt(userIdParam, 10));
        }

        fetchReviews();
    }, [searchParams]);

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitReview = async () => {
        if (!userId) {
            setError('User ID is missing. Please create a user first.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating, comment, placeName, userId, photo }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            const data = await response.json();
            setRating(null);
            setComment('');
            setPlaceName(''); // Reset place name
            setPhoto(null);
            setError('');

            fetchReviews();
        } catch (error) {
            setError('Failed to submit review. Please try again.');
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/reviews');
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Alien Themed Bathroom Review</h1>
            <p className={styles.form}>Submit your review for our out-of-this-world bathrooms!</p>
            {error && <p className="error-message">{error}</p>}
            <div className={styles.form}>
                <input
                    type="text"
                    placeholder="Name of the Place"
                    className={styles.input}
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Rating"
                    className={styles.input}
                    value={rating || ''}
                    onChange={(e) => setRating(Number(e.target.value))}
                    min="1"
                    max="5"
                />
                <textarea
                    placeholder="Comment"
                    className={styles.textarea}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className={styles.input}
                />
                {photo && (
                    <Image
                        src={photo}
                        alt="Uploaded preview"
                        className={styles.reviewPhoto}
                        width={500} // replace with actual dimensions
                        height={300} // replace with actual dimensions
                    />
                )}
                <button
                    onClick={submitReview}
                    className={styles.button}
                    disabled={!rating || !comment || !placeName || !userId}
                >
                    Submit Review
                </button>
            </div>

            <div className={styles.reviews}>
                <h2 className={styles.title}>Recent Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className={styles.reviewCard}>
                            <p><strong>Place Name:</strong> {review.placeName}</p>
                            <p><strong>Rating:</strong> {review.rating} / 5</p>
                            <p><strong>Comment:</strong> {review.comment}</p>
                            {review.photo && (
                                <Image
                                    src={review.photo}
                                    alt="Review photo"
                                    className={styles.reviewPhoto}
                                    width={500} // replace with actual dimensions
                                    height={300} // replace with actual dimensions
                                />
                            )}
                            <p className="text-sm text-gray-500 mt-2">Reviewed by: {review.user.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet. Be the first to review!</p>
                )}
            </div>
        </div>
    );
};

const ReviewPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReviewForm />
        </Suspense>
    );
};

export default ReviewPage;
