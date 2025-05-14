import { useState, useEffect } from 'react';
import { IonApp, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButton, IonInput, IonLabel, IonModal, IonFooter, IonCard, 
  IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, 
  IonAlert, IonText, IonAvatar, IonCol, IonGrid, IonRow, 
  IonIcon, IonPopover, IonItem, IonSelect, IonSelectOption, 
  IonRange, IonBadge, IonSearchbar } from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { star, pencil, trash, videocam, starHalf } from 'ionicons/icons';

interface MovieRating {
  rating_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  movie_title: string;
  rating_value: number;
  review_content: string;
  created_at: string;
  updated_at: string;
}

const MovieRatingContainer = () => {
  const [ratings, setRatings] = useState<MovieRating[]>([]);
  const [movieTitle, setMovieTitle] = useState('');
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [editingRating, setEditingRating] = useState<MovieRating | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [popoverState, setPopoverState] = useState<{ 
    open: boolean; 
    event: Event | null; 
    ratingId: string | null 
  }>({ open: false, event: null, ratingId: null });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email?.endsWith('@nbsc.edu.ph')) {
        setUser(authData.user);
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_id, username, user_avatar_url')
          .eq('user_email', authData.user.email)
          .single();
        if (!error && userData) {
          setUser({ ...authData.user, id: userData.user_id });
          setUsername(userData.username);
        }
      }
    };
    
    const fetchRatings = async () => {
      const { data, error } = await supabase
        .from('movie_ratings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setRatings(data as MovieRating[]);
    };
    
    fetchUser();
    fetchRatings();
  }, []);

  const createRating = async () => {
    if (!movieTitle || !reviewContent || !user || !username) {
      setAlertMessage('Please fill in all fields');
      setIsAlertOpen(true);
      return;
    }
  
    // Fetch avatar URL
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_avatar_url')
      .eq('user_id', user.id)
      .single();
  
    if (userError) {
      console.error('Error fetching user avatar:', userError);
      return;
    }
  
    const avatarUrl = userData?.user_avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg';
  
    // Insert rating with avatar URL
    const { data, error } = await supabase
      .from('movie_ratings')
      .insert([
        { 
          movie_title: movieTitle,
          rating_value: ratingValue,
          review_content: reviewContent,
          user_id: user.id, 
          username, 
          avatar_url: avatarUrl 
        }
      ])
      .select('*');
  
    if (!error && data) {
      setRatings([data[0] as MovieRating, ...ratings]);
      setAlertMessage('Movie rating posted successfully!');
      setIsAlertOpen(true);
    } else {
      setAlertMessage('Failed to post rating');
      setIsAlertOpen(true);
    }
  
    resetForm();
  };

  const deleteRating = async (rating_id: string) => {
    await supabase.from('movie_ratings').delete().match({ rating_id });
    setRatings(ratings.filter(rating => rating.rating_id !== rating_id));
    setAlertMessage('Rating deleted successfully!');
    setIsAlertOpen(true);
  };

  const startEditingRating = (rating: MovieRating) => {
    setEditingRating(rating);
    setMovieTitle(rating.movie_title);
    setRatingValue(rating.rating_value);
    setReviewContent(rating.review_content);
    setIsModalOpen(true);
  };

  const saveRating = async () => {
    if (!movieTitle || !reviewContent || !editingRating) return;
    
    const { data, error } = await supabase
      .from('movie_ratings')
      .update({ 
        movie_title: movieTitle,
        rating_value: ratingValue,
        review_content: reviewContent
      })
      .match({ rating_id: editingRating.rating_id })
      .select('*');
      
    if (!error && data) {
      const updatedRating = data[0] as MovieRating;
      setRatings(ratings.map(rating => 
        (rating.rating_id === updatedRating.rating_id ? updatedRating : rating)
      ));
      resetForm();
      setEditingRating(null);
      setIsModalOpen(false);
      setAlertMessage('Rating updated successfully!');
      setIsAlertOpen(true);
    }
  };
  
  const resetForm = () => {
    setMovieTitle('');
    setRatingValue(5);
    setReviewContent('');
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<IonIcon key={i} icon={star} color="warning" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<IonIcon key={i} icon={starHalf} color="warning" />);
      } else {
        stars.push(<IonIcon key={i} icon={star} color="medium" />);
      }
    }
    return stars;
  };

  const filteredRatings = searchQuery 
    ? ratings.filter(rating => 
        rating.movie_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rating.review_content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ratings;

  return (
    <>
      <IonContent>
        {user ? (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Rate a Movie</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem>
                  <IonLabel position="stacked">Movie Title</IonLabel>
                  <IonInput 
                    value={movieTitle} 
                    onIonChange={e => setMovieTitle(e.detail.value!)} 
                    placeholder="Enter movie title" 
                  />
                </IonItem>
                
                <IonItem>
                  <IonLabel>Your Rating: {ratingValue}/5</IonLabel>
                  <IonRange 
                    min={1} 
                    max={5} 
                    step={0.5} 
                    value={ratingValue}
                    onIonChange={e => setRatingValue(e.detail.value as number)}
                  >
                    <IonIcon slot="start" icon={starHalf} />
                    <IonIcon slot="end" icon={star} />
                  </IonRange>
                </IonItem>
                
                <IonItem>
                  <IonLabel position="stacked">Your Review</IonLabel>
                  <IonInput 
                    value={reviewContent} 
                    onIonChange={e => setReviewContent(e.detail.value!)} 
                    placeholder="Write your review..." 
                  />
                </IonItem>
              </IonCardContent>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem' }}>
                <IonButton onClick={createRating}>
                  <IonIcon slot="start" icon={videocam} />
                  Post Rating
                </IonButton>
              </div>
            </IonCard>

            <IonSearchbar 
              value={searchQuery}
              onIonChange={e => setSearchQuery(e.detail.value!)}
              placeholder="Search ratings..."
            />

            {filteredRatings.map(rating => (
              <IonCard key={rating.rating_id} style={{ marginTop: '1rem' }}>
                <IonCardHeader>
                  <IonRow>
                    <IonCol size="1.85">
                      <IonAvatar>
                        <img alt={rating.username} src={rating.avatar_url} />
                      </IonAvatar>
                    </IonCol>
                    <IonCol>
                      <IonCardTitle>{rating.username}</IonCardTitle>
                      <IonCardSubtitle>{new Date(rating.created_at).toLocaleString()}</IonCardSubtitle>
                    </IonCol>
                    <IonCol size="auto">
                      <IonButton
                        fill="clear"
                        onClick={(e) => setPopoverState({ 
                          open: true, 
                          event: e.nativeEvent, 
                          ratingId: rating.rating_id 
                        })}
                      >
                        <IonIcon color="secondary" icon={pencil} />
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonCardHeader>
              
                <IonCardContent>
                  <IonText>
                    <h2><strong>{rating.movie_title}</strong></h2>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                      {renderStars(rating.rating_value)}
                      <IonBadge color="warning" style={{ marginLeft: '10px' }}>
                        {rating.rating_value.toFixed(1)}
                      </IonBadge>
                    </div>
                    <p>{rating.review_content}</p>
                    {rating.updated_at !== rating.created_at && (
                      <IonText color="medium">
                        <small>Edited on {new Date(rating.updated_at).toLocaleString()}</small>
                      </IonText>
                    )}
                  </IonText>
                </IonCardContent>
                
                <IonPopover
                  isOpen={popoverState.open && popoverState.ratingId === rating.rating_id}
                  event={popoverState.event}
                  onDidDismiss={() => setPopoverState({ open: false, event: null, ratingId: null })}
                >
                  <IonButton fill="clear" onClick={() => { 
                    startEditingRating(rating); 
                    setPopoverState({ open: false, event: null, ratingId: null }); 
                  }}>
                    <IonIcon slot="start" icon={pencil} />
                    Edit
                  </IonButton>
                  <IonButton fill="clear" color="danger" onClick={() => { 
                    deleteRating(rating.rating_id); 
                    setPopoverState({ open: false, event: null, ratingId: null }); 
                  }}>
                    <IonIcon slot="start" icon={trash} />
                    Delete
                  </IonButton>
                </IonPopover>
              </IonCard>
            ))}
          </>
        ) : (
          <IonLabel>Loading...</IonLabel>
        )}
      </IonContent>

      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Movie Rating</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonItem>
            <IonLabel position="stacked">Movie Title</IonLabel>
            <IonInput 
              value={movieTitle} 
              onIonChange={e => setMovieTitle(e.detail.value!)} 
              placeholder="Enter movie title" 
            />
          </IonItem>
          
          <IonItem>
            <IonLabel>Your Rating: {ratingValue}/5</IonLabel>
            <IonRange 
              min={1} 
              max={5} 
              step={0.5} 
              value={ratingValue}
              onIonChange={e => setRatingValue(e.detail.value as number)}
            >
              <IonIcon slot="start" icon={starHalf} />
              <IonIcon slot="end" icon={star} />
            </IonRange>
          </IonItem>
          
          <IonItem>
            <IonLabel position="stacked">Your Review</IonLabel>
            <IonInput 
              value={reviewContent} 
              onIonChange={e => setReviewContent(e.detail.value!)} 
              placeholder="Write your review..." 
            />
          </IonItem>
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
              <IonButton strong onClick={saveRating}>Save</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonModal>

      <IonAlert
        isOpen={isAlertOpen}
        onDidDismiss={() => setIsAlertOpen(false)}
        header="Message"
        message={alertMessage}
        buttons={['OK']}
      />
    </>
  );
};

const IonButtons = ({ children, slot }) => {
  return (
    <div className={`ion-buttons ${slot ? `ion-buttons-${slot}` : ''}`} style={slot === 'end' ? { display: 'flex', justifyContent: 'flex-end' } : {}}>
      {children}
    </div>
  );
};

export default MovieRatingContainer;