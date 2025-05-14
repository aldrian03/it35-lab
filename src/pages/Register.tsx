import React, { useState } from 'react';
import {
    IonButton,
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    IonPage,
    IonTitle,
    IonModal,
    IonText,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonAlert,
    IonIcon,
} from '@ionic/react';
import { 
  personOutline, 
  mailOutline, 
  lockClosedOutline, 
  personCircleOutline,
  textOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';
import bcrypt from 'bcryptjs';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    // Navy and teal color palette - matching login page
    const colors = {
        navy: '#0A2342',
        lightNavy: '#12395D',
        teal: '#2CA6A4',
        lightTeal: '#50C5B7',
        background: '#F6F7F9',
        white: '#FFFFFF',
        lightGray: '#E8EEF2'
    };

    const handleOpenVerificationModal = () => {
        if (!email.endsWith("@nbsc.edu.ph")) {
            setAlertMessage("Only @nbsc.edu.ph emails are allowed to register.");
            setShowAlert(true);
            return;
        }

        if (password !== confirmPassword) {
            setAlertMessage("Passwords do not match.");
            setShowAlert(true);
            return;
        }

        setShowVerificationModal(true);
    };

    const doRegister = async () => {
        setShowVerificationModal(false);
    
        try {
            // Sign up in Supabase authentication
            const { data, error } = await supabase.auth.signUp({ email, password });
    
            if (error) {
                throw new Error("Account creation failed: " + error.message);
            }
    
            // Hash password before storing in the database
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            // Insert user data into 'users' table
            const { error: insertError } = await supabase.from("users").insert([
                {
                    username,
                    user_email: email,
                    user_firstname: firstName,
                    user_lastname: lastName,
                    user_password: hashedPassword,
                },
            ]);
    
            if (insertError) {
                throw new Error("Failed to save user data: " + insertError.message);
            }
    
            setShowSuccessModal(true);
        } catch (err) {
            // Ensure err is treated as an Error instance
            if (err instanceof Error) {
                setAlertMessage(err.message);
            } else {
                setAlertMessage("An unknown error occurred.");
            }
            setShowAlert(true);
        }
    };
    
    return (
        <IonPage>
            <IonContent className='ion-padding' style={{
                '--background': colors.background,
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: '480px',
                    margin: '0 auto',
                    padding: '20px',
                }}>
                    <div style={{
                        background: colors.white,
                        borderRadius: '16px',
                        padding: '32px 24px',
                        width: '100%',
                        boxShadow: '0 8px 30px rgba(10, 35, 66, 0.08)',
                    }}>
                        <div style={{
                            width: '100%',
                            textAlign: 'center',
                            marginBottom: '25px'
                        }}>
                            <div style={{
                                background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.teal} 100%)`,
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                boxShadow: '0 6px 15px rgba(10, 35, 66, 0.15)'
                            }}>
                                <IonIcon 
                                    icon={personCircleOutline}
                                    style={{ fontSize: '36px', color: colors.white }} 
                                />
                            </div>
                            <h2 style={{
                                color: colors.navy,
                                fontWeight: '600',
                                fontSize: '24px',
                                margin: '0'
                            }}>Create Account</h2>
                        </div>

                        <div style={{ width: '100%', marginBottom: '16px', position: 'relative' }}>
                            <IonIcon icon={personOutline} style={{ 
                                position: 'absolute', 
                                left: '14px', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: colors.navy,
                                fontSize: '18px',
                                zIndex: 1
                            }}/>
                            <IonInput
                                placeholder="Username"
                                value={username}
                                onIonChange={e => setUsername(e.detail.value!)}
                                style={{ 
                                    '--border-radius': '8px',
                                    '--padding-start': '40px',
                                    '--padding-end': '16px',
                                    '--background': colors.lightGray,
                                    '--border-color': 'transparent',
                                    '--placeholder-color': colors.lightNavy,
                                    '--placeholder-opacity': '0.6',
                                    '--color': colors.navy
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ width: '50%', position: 'relative' }}>
                                <IonIcon icon={textOutline} style={{ 
                                    position: 'absolute', 
                                    left: '14px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    color: colors.navy,
                                    fontSize: '18px',
                                    zIndex: 1
                                }}/>
                                <IonInput
                                    placeholder="First Name"
                                    value={firstName}
                                    onIonChange={e => setFirstName(e.detail.value!)}
                                    style={{ 
                                        '--border-radius': '8px',
                                        '--padding-start': '40px',
                                        '--padding-end': '16px',
                                        '--background': colors.lightGray,
                                        '--border-color': 'transparent',
                                        '--placeholder-color': colors.lightNavy,
                                        '--placeholder-opacity': '0.6',
                                        '--color': colors.navy
                                    }}
                                />
                            </div>
                            <div style={{ width: '50%', position: 'relative' }}>
                                <IonIcon icon={textOutline} style={{ 
                                    position: 'absolute', 
                                    left: '14px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    color: colors.navy,
                                    fontSize: '18px',
                                    zIndex: 1
                                }}/>
                                <IonInput
                                    placeholder="Last Name"
                                    value={lastName}
                                    onIonChange={e => setLastName(e.detail.value!)}
                                    style={{ 
                                        '--border-radius': '8px',
                                        '--padding-start': '40px',
                                        '--padding-end': '16px',
                                        '--background': colors.lightGray,
                                        '--border-color': 'transparent',
                                        '--placeholder-color': colors.lightNavy,
                                        '--placeholder-opacity': '0.6',
                                        '--color': colors.navy
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ width: '100%', marginBottom: '16px', position: 'relative' }}>
                            <IonIcon icon={mailOutline} style={{ 
                                position: 'absolute', 
                                left: '14px', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: colors.navy,
                                fontSize: '18px',
                                zIndex: 1
                            }}/>
                            <IonInput
                                placeholder="Email (@nbsc.edu.ph)"
                                type="email"
                                value={email}
                                onIonChange={e => setEmail(e.detail.value!)}
                                style={{ 
                                    '--border-radius': '8px',
                                    '--padding-start': '40px',
                                    '--padding-end': '16px',
                                    '--background': colors.lightGray,
                                    '--border-color': 'transparent',
                                    '--placeholder-color': colors.lightNavy,
                                    '--placeholder-opacity': '0.6',
                                    '--color': colors.navy
                                }}
                            />
                        </div>

                        <div style={{ width: '100%', marginBottom: '16px', position: 'relative' }}>
                            <IonIcon icon={lockClosedOutline} style={{ 
                                position: 'absolute', 
                                left: '14px', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: colors.navy,
                                fontSize: '18px',
                                zIndex: 1
                            }}/>
                            <IonInput
                                placeholder="Password"
                                type="password"
                                value={password}
                                onIonChange={e => setPassword(e.detail.value!)}
                                style={{ 
                                    '--border-radius': '8px',
                                    '--padding-start': '40px',
                                    '--padding-end': '16px',
                                    '--background': colors.lightGray,
                                    '--border-color': 'transparent',
                                    '--placeholder-color': colors.lightNavy,
                                    '--placeholder-opacity': '0.6',
                                    '--color': colors.navy
                                }}
                            >
                                <IonInputPasswordToggle slot="end" style={{ color: colors.navy }}></IonInputPasswordToggle>
                            </IonInput>
                        </div>

                        <div style={{ width: '100%', marginBottom: '24px', position: 'relative' }}>
                            <IonIcon icon={lockClosedOutline} style={{ 
                                position: 'absolute', 
                                left: '14px', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: colors.navy,
                                fontSize: '18px',
                                zIndex: 1
                            }}/>
                            <IonInput
                                placeholder="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onIonChange={e => setConfirmPassword(e.detail.value!)}
                                style={{ 
                                    '--border-radius': '8px',
                                    '--padding-start': '40px',
                                    '--padding-end': '16px',
                                    '--background': colors.lightGray,
                                    '--border-color': 'transparent',
                                    '--placeholder-color': colors.lightNavy,
                                    '--placeholder-opacity': '0.6',
                                    '--color': colors.navy
                                }}
                            >
                                <IonInputPasswordToggle slot="end" style={{ color: colors.navy }}></IonInputPasswordToggle>
                            </IonInput>
                        </div>

                        <IonButton 
                            onClick={handleOpenVerificationModal} 
                            expand="block" 
                            style={{ 
                                width: '100%',
                                '--background': `linear-gradient(135deg, ${colors.navy} 0%, ${colors.teal} 100%)`,
                                '--border-radius': '8px',
                                '--box-shadow': '0 6px 12px rgba(10, 35, 66, 0.1)',
                                marginBottom: '16px',
                                height: '44px'
                            }}
                        >
                            Create Account
                        </IonButton>
                        
                        <IonButton 
                            routerLink="/it35-lab" 
                            expand="block" 
                            fill="clear"
                            style={{
                                '--color': colors.teal,
                                '--background': 'transparent',
                                fontSize: '14px'
                            }}
                        >
                            Already have an account? Sign in
                        </IonButton>
                    </div>
                </div>

                {/* Verification Modal */}
                <IonModal isOpen={showVerificationModal} onDidDismiss={() => setShowVerificationModal(false)}>
                    <IonContent className="ion-padding" style={{
                        '--background': colors.background,
                    }}>
                        <IonCard style={{ 
                            marginTop: '10vh',
                            borderRadius: '16px',
                            boxShadow: '0 8px 16px rgba(10, 35, 66, 0.1)',
                        }}>
                            <IonCardHeader style={{ background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.teal} 100%)`, color: colors.white, borderTopLeftRadius: '16px', borderTopRightRadius: '16px', padding: '20px' }}>
                                <IonCardTitle style={{ color: colors.white, fontSize: '20px' }}>Confirm Your Details</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent style={{ padding: '24px' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <IonCardSubtitle style={{ color: colors.lightNavy, fontSize: '14px', marginBottom: '4px' }}>Username</IonCardSubtitle>
                                    <div style={{ color: colors.navy, fontSize: '16px', fontWeight: '500' }}>{username}</div>
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <IonCardSubtitle style={{ color: colors.lightNavy, fontSize: '14px', marginBottom: '4px' }}>Name</IonCardSubtitle>
                                    <div style={{ color: colors.navy, fontSize: '16px', fontWeight: '500' }}>{firstName} {lastName}</div>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <IonCardSubtitle style={{ color: colors.lightNavy, fontSize: '14px', marginBottom: '4px' }}>Email</IonCardSubtitle>
                                    <div style={{ color: colors.navy, fontSize: '16px', fontWeight: '500' }}>{email}</div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <IonButton 
                                        fill="outline" 
                                        onClick={() => setShowVerificationModal(false)}
                                        style={{ 
                                            '--border-color': colors.lightNavy,
                                            '--color': colors.lightNavy,
                                            '--border-radius': '6px'
                                        }}
                                    >
                                        Cancel
                                    </IonButton>
                                    <IonButton 
                                        onClick={doRegister}
                                        style={{ 
                                            '--background': `linear-gradient(135deg, ${colors.navy} 0%, ${colors.teal} 100%)`,
                                            '--border-radius': '6px'
                                        }}
                                    >
                                        Confirm
                                    </IonButton>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonContent>
                </IonModal>

                {/* Success Modal */}
                <IonModal isOpen={showSuccessModal} onDidDismiss={() => setShowSuccessModal(false)}>
                    <IonContent className="ion-padding" style={{
                        '--background': colors.background,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%'
                    }}>
                        <div style={{
                            background: colors.white, 
                            borderRadius: '16px',
                            padding: '35px 30px',
                            textAlign: 'center',
                            maxWidth: '320px',
                            margin: '0 auto',
                            boxShadow: '0 8px 30px rgba(10, 35, 66, 0.08)'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.teal} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                boxShadow: '0 8px 16px rgba(44, 166, 164, 0.3)'
                            }}>
                                <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '40px', color: colors.white }} />
                            </div>
                            
                            <h2 style={{ color: colors.navy, fontSize: '22px', fontWeight: '600', marginBottom: '15px' }}>
                                Registration Successful
                            </h2>
                            
                            <p style={{ color: colors.lightNavy, fontSize: '15px', lineHeight: '1.5', marginBottom: '25px' }}>
                                Your account has been created successfully. Please check your email address to verify your account.
                            </p>
                            
                            <IonButton 
                                routerLink="/it35-lab" 
                                routerDirection="back" 
                                style={{ 
                                    '--background': `linear-gradient(135deg, ${colors.navy} 0%, ${colors.teal} 100%)`,
                                    '--border-radius': '8px',
                                    marginTop: '10px'
                                }}
                            >
                                Go to Login
                            </IonButton>
                        </div>
                    </IonContent>
                </IonModal>

                {/* Alert */}
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Notification"
                    message={alertMessage}
                    buttons={['OK']}
                    cssClass="custom-alert"
                />
            </IonContent>
        </IonPage>
    );
};

export default Register;