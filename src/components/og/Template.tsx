import React from 'react';

interface OGTemplateProps {
    type: string;
    title: string;
    description: string;
    logoSrc?: string;
}

export function OGTemplate({ type, title, description, logoSrc }: OGTemplateProps) {
    return (
        <div
            style={{
                display: 'flex',
                height: '100%',
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#111827', // Gray-900
                color: 'white',
                backgroundImage: 'radial-gradient(circle at 25px 25px, #1f2937 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1f2937 2%, transparent 0%)',
                backgroundSize: '100px 100px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    height: '120px',
                }}
            >
                {logoSrc ? (
                    <img
                        src={logoSrc}
                        style={{
                            height: '100%',
                            objectFit: 'contain',
                        }}
                    />
                ) : (
                    <div style={{ fontSize: 60, fontWeight: 900, color: '#f59e0b' }}>GUARDMAN</div>
                )}
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '40px',
                    maxWidth: '900px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
            >
                <div
                    style={{
                        fontSize: 24,
                        color: '#9ca3af',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                    }}
                >
                    {type}
                </div>
                <h1
                    style={{
                        fontSize: 72,
                        fontWeight: 800,
                        margin: '0 0 20px 0',
                        lineHeight: 1.1,
                        backgroundImage: 'linear-gradient(to bottom right, #ffffff, #9ca3af)',
                        backgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    {title}
                </h1>
                <p
                    style={{
                        fontSize: 32,
                        color: '#d1d5db',
                        margin: 0,
                        lineHeight: 1.5,
                        textWrap: 'balance',
                    }}
                >
                    {description.length > 120 ? description.substring(0, 120) + '...' : description}
                </p>
            </div>
        </div>
    );
}
