export default {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: `
                            default-src 'self';
                            script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
                            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https:;
                            img-src 'self' data: https: http:;
                            font-src 'self' https://fonts.gstatic.com;
                            connect-src 'self' https:;
                            object-src 'none';
                            frame-src 'self';
                            base-uri 'self';
                            form-action 'self';
                            frame-ancestors 'self';
                            upgrade-insecure-requests;
                        `.replace(/\s{2,}/g, ' ').trim(), // Minimize whitespace
                    },
                ],
            },
        ];
    },
};
