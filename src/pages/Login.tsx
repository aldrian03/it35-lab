import { 
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent, 
  IonIcon, 
  IonInput, 
  IonInputPasswordToggle,  
  IonPage,  
  IonToast,  
  useIonRouter
} from '@ionic/react';
import { logoIonic, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Navy and teal color palette
  const colors = {
    navy: '#0A2342',
    lightNavy: '#12395D',
    teal: '#2CA6A4',
    lightTeal: '#50C5B7',
    background: '#F6F7F9',
    white: '#FFFFFF',
    lightGray: '#E8EEF2'
  };

  const doLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      return;
    }
    setShowToast(true); 
    setTimeout(() => {
      navigation.push('/it35-lab/app', 'forward', 'replace');
    }, 300);
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
          height: '100%',
          maxWidth: '380px',
          margin: '0 auto',
          padding: '20px'
        }}>
          <div style={{
            background: colors.white,
            borderRadius: '16px',
            padding: '32px 24px',
            width: '100%',
            boxShadow: '0 8px 30px rgba(10, 35, 66, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.teal} 100%)`,
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: '0 6px 15px rgba(10, 35, 66, 0.15)'
            }}>
              <IonIcon 
                icon={logoIonic}
                style={{ fontSize: '45px', color: colors.white }} 
              />
            </div>
            
            <h2 style={{
              color: colors.navy,
              fontWeight: '600',
              fontSize: '24px',
              marginBottom: '28px',
              textAlign: 'center'
            }}>Sign In</h2>
            
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
                fill="outline"
                type="email"
                placeholder="Email"
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
                fill="outline"
                type="password"
                placeholder="Password"
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
            
            <IonButton 
              onClick={doLogin} 
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
              Sign In
            </IonButton>
            
            <IonButton 
              routerLink="/it35-lab/register" 
              expand="block" 
              fill="clear"
              style={{
                '--color': colors.teal,
                '--background': 'transparent',
                fontSize: '14px'
              }}
            >
              Create an account
            </IonButton>
          </div>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Error"
          message={alertMessage}
          buttons={['OK']}
          cssClass="custom-alert"
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Login successful! Redirecting..."
          duration={1500}
          position="top"
          color="success"
          style={{ '--background': colors.teal, '--color': colors.white }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;