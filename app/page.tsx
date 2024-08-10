import styles from './HomePage.module.css';
import Link from 'next/link';

export default function HomePage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to the Alien Bathroom Review App</h1>
            <p className={styles.description}>Explore the galaxy&apos;s most exotic and otherworldly bathroom experiences!</p>
            <div>
                <Link href="/review" className={styles.link}>
                    Go to Review Page
                </Link>
                <Link href="/create-user" className={styles.link}>
                    Create New User
                </Link>
            </div>
        </div>
    );
}
