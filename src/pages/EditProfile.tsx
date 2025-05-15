import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent, IonPage, IonInput, IonButton, IonAlert, IonHeader,
  IonBackButton, IonButtons, IonItem, IonText, IonCol, IonGrid,
  IonRow, IonInputPasswordToggle, IonImg, IonAvatar, IonToolbar, IonTitle, 
  IonCard, IonCardContent, IonIcon, IonLabel, IonCardHeader, IonCardTitle,
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { useHistory } from 'react-router-dom';
import { personCircleOutline, keyOutline, cameraOutline } from 'ionicons/icons';

const EditProfile: React.FC = () => {
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const history = useHistory();
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    // Custom theme colors
    const navyColor = '#0a1929';
    const tealColor = '#00a3a3';
    const tealLight = '#4dd0e1';
    const navyLight = '#1a3353';
    const whiteText = '#ffffff';
    const grayBg = '#f5f7fa';
  
    useEffect(() => {
        const fetchSessionAndData = async () => {
          // Fetch the current session
          const { data: session, error: sessionError } = await supabase.auth.getSession();
      
          if (sessionError || !session || !session.session) {
            setAlertMessage('You must be logged in to access this page.');
            setShowAlert(true);
            history.push('/it35-lab/login'); // Redirect to login if no session is found
            return;
          }
      
          // Fetch user details from Supabase using the session's email
          const { data: user, error: userError } = await supabase
            .from('users')
            .select('user_firstname, user_lastname, user_avatar_url, user_email, username')
            .eq('user_email', session.session.user.email) // Use email from the session
            .single();
      
          if (userError || !user) {
            setAlertMessage('User data not found.');
            setShowAlert(true);
            return;
          }
      
          // Populate form fields with the retrieved data
          setFirstName(user.user_firstname || '');
          setLastName(user.user_lastname || '');
          setAvatarPreview(user.user_avatar_url);
          setEmail(user.user_email);
          setUsername(user.username || '');
        };
      
        fetchSessionAndData();
      }, [history]);
  
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      }
    };
  
    const handleUpdate = async () => {
        if (password !== confirmPassword) {
          setAlertMessage("Passwords don't match.");
          setShowAlert(true);
          return;
        }
      
        // Fetch the current session
        const { data: session, error: sessionError } = await supabase.auth.getSession();
      
        if (sessionError || !session || !session.session) {
          setAlertMessage('Error fetching session or no session available.');
          setShowAlert(true);
          return;
        }
      
        const user = session.session.user;
      
        if (!user.email) {
            setAlertMessage('Error: User email is missing.');
            setShowAlert(true);
            return;
          }
          
          const { error: passwordError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
          });
          
      
        if (passwordError) {
          setAlertMessage('Incorrect current password.');
          setShowAlert(true);
          return;
        }
      
        // Handle avatar upload if the avatar file is changed
        let avatarUrl = avatarPreview;
      
        if (avatarFile) {
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;
          
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('user-avatars')
              .upload(filePath, avatarFile, {
                cacheControl: '3600',
                upsert: true,  // Allows overwriting existing files
              });
          
            if (uploadError) {
              setAlertMessage(`Avatar upload failed: ${uploadError.message}`);
              setShowAlert(true);
              return;
            }
          
            // Retrieve the public URL
            const { data } = supabase.storage.from('user-avatars').getPublicUrl(filePath);
            avatarUrl = data.publicUrl;
          }
          
      
        // Update user data in the users table
        const { error: updateError } = await supabase
          .from('users')
          .update({
            user_firstname: firstName,
            user_lastname: lastName,
            user_avatar_url: avatarUrl,
            username: username,
          })
          .eq('user_email', user.email);
      
        if (updateError) {
          setAlertMessage(updateError.message);
          setShowAlert(true);
          return;
        }
      
        // Update the password if a new password is provided
        if (password) {
          const { error: passwordUpdateError } = await supabase.auth.updateUser({
            password: password,
          });
      
          if (passwordUpdateError) {
            setAlertMessage(passwordUpdateError.message);
            setShowAlert(true);
            return;
          }
        }
      
        setAlertMessage('Account updated successfully!');
        setShowAlert(true);
        history.push('/it35-lab/app');
      };
      
    // Custom styles for the components
    const styles = {
      page: {
        '--background': grayBg,
      },
      header: {
        '--background': navyColor,
      },
      backButton: {
        '--color': whiteText,
      },
      title: {
        color: whiteText,
      },
      content: {
        '--background': grayBg,
        '--padding-top': '20px',
        '--padding-bottom': '20px',
      },
      card: {
        marginBottom: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
      cardHeader: {
        '--background': navyColor,
        '--color': whiteText,
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
      },
      cardTitle: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
      },
      input: {
        '--background': '#ffffff',
        '--color': navyColor,
        '--placeholder-color': '#aaaaaa',
        '--border-color': navyLight,
        '--border-radius': '8px',
        marginBottom: '10px',
      },
      avatarContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
      },
      avatarWrapper: {
        border: `4px solid ${tealColor}`,
        overflow: 'hidden',
        width: '180px',
        height: '180px',
        margin: '0 auto 20px auto',
      },
      avatar: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
      primaryButton: {
        '--background': tealColor,
        '--background-hover': tealLight,
        '--color': whiteText,
        '--border-radius': '24px',
        margin: '10px 0',
        fontWeight: 'bold',
        fontSize: '1rem',
      },
      secondaryButton: {
        '--background': navyColor,
        '--background-hover': navyLight,
        '--color': whiteText,
        '--border-radius': '24px',
        margin: '10px 0',
        fontWeight: 'bold',
        fontSize: '1rem',
      },
      sectionHeader: {
        color: navyColor,
        fontSize: '1.3rem',
        fontWeight: 'bold',
        margin: '15px 0 10px 0',
        paddingLeft: '10px',
        borderLeft: `4px solid ${tealColor}`,
      },
      icon: {
        color: tealColor,
        fontSize: '24px',
        marginRight: '8px',
      },
    };
  
    return (
      <IonPage style={styles.page}>
        <IonHeader style={styles.header}>
          <IonToolbar style={styles.header}>
            <IonButtons slot="start">
              <IonBackButton style={styles.backButton} defaultHref="/it35-lab/app" />
            </IonButtons>
            <IonTitle style={styles.title}>Edit Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonContent style={styles.content} className="ion-padding">
          {/* Profile Card */}
          <IonCard style={styles.card}>
            <IonCardHeader style={styles.cardHeader}>
              <IonCardTitle style={styles.cardTitle}>Profile Information</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {/* Avatar Upload Section */}
              <div style={styles.avatarContainer}>
                <IonAvatar style={styles.avatarWrapper}>
                  {avatarPreview ? (
                    <IonImg src={avatarPreview} style={styles.avatar} />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      background: navyLight, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <IonIcon icon={personCircleOutline} style={{ fontSize: '100px', color: whiteText }} />
                    </div>
                  )}
                </IonAvatar>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleAvatarChange}
                />

                <IonButton 
                  style={styles.primaryButton} 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IonIcon icon={cameraOutline} slot="start" />
                  Change Avatar
                </IonButton>
              </div>

              {/* Profile Form */}
              <div>
                <h3 style={styles.sectionHeader}>
                  <IonIcon icon={personCircleOutline} style={styles.icon} />
                  Account Details
                </h3>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        label="Username"
                        type="text"
                        labelPlacement="floating"
                        fill="outline"
                        placeholder="Enter username"
                        value={username}
                        onIonChange={(e) => setUsername(e.detail.value!)}
                        style={styles.input}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="6">
                      <IonInput
                        label="First Name"
                        type="text"
                        labelPlacement="floating"
                        fill="outline"
                        placeholder="Enter First Name"
                        value={firstName}
                        onIonChange={(e) => setFirstName(e.detail.value!)}
                        style={styles.input}
                      />
                    </IonCol>
                    <IonCol size="6">
                      <IonInput
                        label="Last Name"
                        type="text"
                        labelPlacement="floating"
                        fill="outline"
                        placeholder="Enter Last Name"
                        value={lastName}
                        onIonChange={(e) => setLastName(e.detail.value!)}
                        style={styles.input}
                      />
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Password Card */}
          <IonCard style={styles.card}>
            <IonCardHeader style={styles.cardHeader}>
              <IonCardTitle style={styles.cardTitle}>Security Settings</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <h3 style={styles.sectionHeader}>
                <IonIcon icon={keyOutline} style={styles.icon} />
                Change Password
              </h3>
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    <IonInput
                      label="New Password"
                      type="password"
                      labelPlacement="floating"
                      fill="outline"
                      placeholder="Enter New Password"
                      value={password}
                      onIonChange={(e) => setPassword(e.detail.value!)}
                      style={styles.input}
                    >
                      <IonInputPasswordToggle slot="end" />
                    </IonInput>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="12">
                    <IonInput
                      label="Confirm Password"
                      type="password"
                      labelPlacement="floating"
                      fill="outline"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                      style={styles.input}
                    >
                      <IonInputPasswordToggle slot="end" />
                    </IonInput>
                  </IonCol>
                </IonRow>
              </IonGrid>

              <h3 style={styles.sectionHeader}>
                <IonIcon icon={keyOutline} style={styles.icon} />
                Confirm Changes
              </h3>
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    <IonInput
                      label="Current Password"
                      type="password"
                      labelPlacement="floating"
                      fill="outline"
                      placeholder="Enter Current Password to Save Changes"
                      value={currentPassword}
                      onIonChange={(e) => setCurrentPassword(e.detail.value!)}
                      style={styles.input}
                    >
                      <IonInputPasswordToggle slot="end" />
                    </IonInput>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* Action Buttons */}
          <div style={{ padding: '10px 16px 30px 16px' }}>
            <IonButton 
              expand="block" 
              onClick={handleUpdate} 
              style={styles.secondaryButton}
              shape="round"
              size="large"
            >
              Update Profile
            </IonButton>
          </div>

          {/* Alert for success or errors */}
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            message={alertMessage}
            buttons={['OK']}
            cssClass="custom-alert"
            // Additional styling can be applied through global CSS
          />
        </IonContent>
      </IonPage>
    );
  };
  
  export default EditProfile;