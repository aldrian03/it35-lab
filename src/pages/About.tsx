import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonInput
} from '@ionic/react';
import {
  checkmarkCircleOutline,
  timeOutline,
  heartOutline,
  lockClosedOutline,
  earthOutline,
  logoGithub,
  logoFacebook,
  logoTwitter,
  logoLinkedin,
  mailOutline,
  callOutline,
  locationOutline
} from 'ionicons/icons';
import React from 'react';

const About: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#0a192f', '--color': '#fff' }}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#f5f5f7' }}>
        <div className="container">
          <IonCard style={{ marginTop: '20px', borderTop: '4px solid #20B2AA' }}>
            <IonCardHeader>
              <IonCardTitle style={{ color: '#0a192f', fontSize: '24px', fontWeight: 'bold' }}>
                About Us
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
              Discover and rate your favorite movies effortlessly.
              Our platform is dedicated to delivering accurate ratings and reliable reviews, helping you find the best films every time.
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard style={{ marginTop: '20px', borderTop: '4px solid #20B2AA' }}>
            <IonCardHeader>
              <IonCardTitle style={{ color: '#0a192f', fontSize: '22px', fontWeight: 'bold' }}>
                Key Features
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="none">
                <FeatureItem 
                  icon={checkmarkCircleOutline} 
                  title="Quality Assurance" 
                  description="Rigorous testing ensures top-notch quality"
                />
                <FeatureItem 
                  icon={timeOutline} 
                  title="24/7 Support" 
                  description="Round-the-clock assistance when you need it"
                />
                <FeatureItem 
                  icon={heartOutline} 
                  title="User-Friendly" 
                  description="Intuitive design for the best experience"
                />
                <FeatureItem 
                  icon={lockClosedOutline} 
                  title="Secure & Private" 
                  description="Your data is protected with advanced encryption"
                />
                <FeatureItem 
                  icon={earthOutline} 
                  title="Global Reach" 
                  description="Serving customers across the world"
                />
              </IonList>
            </IonCardContent>
          </IonCard>

          <IonCard style={{ marginTop: '20px', marginBottom: '20px', borderTop: '4px solid #20B2AA' }}>
            <IonCardHeader>
              <IonCardTitle style={{ color: '#0a192f', fontSize: '22px', fontWeight: 'bold' }}>
                Our Mission
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
                We strive to create innovative solutions that make a difference in people's lives.
                Through cutting-edge technology and dedication to our customers, we aim to set
                new standards in the industry.
              </p>
            </IonCardContent>
          </IonCard>

          {/* Social Media Links */}
          <IonCard style={{ marginTop: '20px', borderTop: '4px solid #20B2AA' }}>
            <IonCardHeader>
              <IonCardTitle style={{ color: '#0a192f', fontSize: '22px', fontWeight: 'bold' }}>
                Connect With Us
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '15px' }}>
                <SocialButton icon={logoGithub} url="https://github.com/aldrian03" label="GitHub" />
                <SocialButton icon={logoFacebook} url="https://www.facebook.com/aldrian.cayomoc.2024" label="Facebook" />
                <SocialButton icon={logoTwitter} url="https://twitter.com/yorme" label="Twitter" />
                <SocialButton icon={logoLinkedin} url="https://linkedin.com/in/yourprofile" label="LinkedIn" />
              </div>
            </IonCardContent>
          </IonCard>

          {/* Contact Us Section */}
          <IonCard style={{ marginTop: '20px', marginBottom: '20px', borderTop: '4px solid #20B2AA' }}>
            <IonCardHeader>
              <IonCardTitle style={{ color: '#0a192f', fontSize: '22px', fontWeight: 'bold' }}>
                Contact Us
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="none">
                <ContactItem icon={mailOutline} info="aldriancayomoc@gmail.com" label="Email" />
                <ContactItem icon={callOutline} info="+1 (555) 123-4567" label="Phone" />
                <ContactItem icon={locationOutline} info="Bukidnon, Manolo Fortich, Philippines" label="Address" />
              </IonList>
              
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#0a192f', marginBottom: '15px' }}>Send us a message</h3>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonInput 
                        label="Name" 
                        labelPlacement="floating" 
                        fill="outline"
                        style={{ marginBottom: '10px' }}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonInput 
                        label="Email" 
                        labelPlacement="floating" 
                        fill="outline"
                        type="email"
                        style={{ marginBottom: '10px' }}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonInput 
                        label="Message" 
                        labelPlacement="floating" 
                        fill="outline" 
                        style={{ height: '100px', marginBottom: '15px' }}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonButton 
                        expand="block" 
                        style={{ '--background': '#0a192f', '--color': '#fff' }}
                      >
                        Send Message
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

// Feature Item Component
const FeatureItem: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <IonItem style={{ '--background': 'transparent' }}>
      <IonIcon
        icon={icon}
        slot="start"
        style={{ color: '#20B2AA', fontSize: '24px' }}
      />
      <IonLabel>
        <h2 style={{ color: '#0a192f', fontWeight: 'bold', marginBottom: '4px' }}>{title}</h2>
        <p style={{ color: '#555', fontSize: '14px' }}>{description}</p>
      </IonLabel>
    </IonItem>
  );
};

// Social Media Button Component
const SocialButton: React.FC<{
  icon: string;
  url: string;
  label: string;
}> = ({ icon, url, label }) => {
  return (
    <IonButton
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        '--background': '#0a192f',
        '--border-radius': '50%',
        width: '50px',
        height: '50px'
      }}
      title={label}
    >
      <IonIcon icon={icon} style={{ fontSize: '24px' }} />
    </IonButton>
  );
};

// Contact Item Component
const ContactItem: React.FC<{
  icon: string;
  info: string;
  label: string;
}> = ({ icon, info, label }) => {
  return (
    <IonItem style={{ '--background': 'transparent' }}>
      <IonIcon
        icon={icon}
        slot="start"
        style={{ color: '#20B2AA', fontSize: '24px' }}
      />
      <IonLabel>
        <h3 style={{ color: '#0a192f', marginBottom: '4px' }}>{label}</h3>
        <p>{info}</p>
      </IonLabel>
    </IonItem>
  );
};

export default About;