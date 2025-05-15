import { 
  IonButtons,
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { useState } from 'react';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: number; title: string; year: number }[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Sample movie data
  const movies = [
    { id: 1, title: 'The Shawshank Redemption', year: 1994 },
    { id: 2, title: 'The Godfather', year: 1972 },
    { id: 3, title: 'The Dark Knight', year: 2008 },
    { id: 4, title: 'Pulp Fiction', year: 1994 },
    { id: 5, title: 'Fight Club', year: 1999 }
  ];

  // Handle search
  const handleSearch = (e: CustomEvent) => {
    const query = (e.detail.value || '').toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      setSearchResults([]);
      return;
    }

    const results = movies.filter(movie => 
      movie.title.toLowerCase().includes(query)
    );

    setSearchResults(results);

    // Add to recent searches if not already present
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]); // Keep only the last 5 searches
    }
  };

  // Handle recent search click
  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    const results = movies.filter(movie => 
      movie.title.toLowerCase().includes(query)
    );
    setSearchResults(results);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="ion-padding">
          {/* Search Bar */}
          <IonSearchbar
            value={searchQuery}
            onIonChange={(e) => handleSearch(e as CustomEvent)}
            placeholder="Search movies..."
          />

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h3>Recent Searches</h3>
              <IonList>
                {recentSearches.map((query, index) => (
                  <IonItem key={index} button onClick={() => handleRecentSearchClick(query)}>
                    <IonLabel>{query}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 ? (
            <IonList>
              {searchResults.map(movie => (
                <IonItem key={movie.id}>
                  <IonLabel>
                    <h2>{movie.title}</h2>
                    <p>{movie.year}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'calc(100% - 60px)',
                textAlign: 'center'
              }}
            >
              {searchQuery ? 'No results found' : 'Search for movies'}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Search;