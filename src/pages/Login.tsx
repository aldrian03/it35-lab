import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonRouter
} from '@ionic/react';
import { atCircleSharp, transgender } from 'ionicons/icons';
import { useState } from 'react';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const doLogin = () => {
    navigation.push('/it35-lab/app', 'forward', 'replace');
  }
  const doRegister = () => {
    navigation.push('/it35-lab/register', 'forward', 'replace');
  }
  return (
    <IonPage>
      <IonContent className='ion-padding'>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '25%'
        }}>
          <IonAvatar
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden'
            }}
          >

            <IonIcon
              icon={atCircleSharp}
              color='primary'
              style={{ fontSize: '120px', color: '#6c757d' }}
            />
          </IonAvatar>
          <h1 style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            
          }}>Welcome back!</h1>
          <p style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: '10',
          }}>Please login your account</p>
          <IonInput
            label="Email"
            labelPlacement="floating"
            fill="outline"
            type="email"
            placeholder="Enter Email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
          />
          <IonInput style={{
            marginTop: '10px',
          }}
            fill="outline"
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
          ><IonInputPasswordToggle slot="end"></IonInputPasswordToggle></IonInput>
        </div>
        <IonButton style={{
          marginTop: '10px'
        }} onClick={doLogin} expand="full" shape='round'>
          Login
        </IonButton>

        <IonButton expand="full" fill="clear" shape='round'onClick={doRegister}>
          Don't have an account? Register here
        </IonButton>
        <IonAlert
                  isOpen={showAlert}
                  onDidDismiss={() => setShowAlert(false)}
                  header="Login Failed"
                  message={errorMessage}
                  buttons={['OK']}
                />

                {/* IonToast for success message */}
                <IonToast
                  isOpen={showToast}
                  onDidDismiss={() => setShowToast(false)}
                  message="Login successful! Redirecting..."
                  duration={1500}
                  position="top"
                  color="primary"
                />
      </IonContent>
    </IonPage>
  );
};

export default Login;