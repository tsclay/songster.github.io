import React, { useEffect } from 'react';
import { ContentAction } from '../../models/interfaces';

import './SearchResults.scss';

interface Props {
  searchTerm: string | null;
  contentReducer: React.Dispatch<ContentAction>;
  rememberSongs: React.Dispatch<React.SetStateAction<never[]>>;
  songs: never[];
}

// This component only needs the setSongs hook, not songs

export const SearchResults: React.FC<Props> = (props) => {
  const { searchTerm, contentReducer, rememberSongs, songs } = props;
  // const [songs, setSongs] = useState([]);

  const callDispatchOp = (e: React.SyntheticEvent) => {
    if (!(e.currentTarget instanceof HTMLDivElement)) {
      return;
    }
    console.log(e.currentTarget.dataset.url);
    contentReducer({
      type: 'LYRICS',
      searchTerm: null,
      urlToLyrics: e.currentTarget.dataset.url!,
    });
  };

  useEffect(() => {
    if (searchTerm) {
      const fetchGenius = async (query: string): Promise<any> => {
        const token =
          'Kk8yGYv93-tGb_--I0iwDhMDP8VAeGrv99MyWjk5KgepAlSGPCjTLbavINlIuyO1';
        const url = `https://api.genius.com/search?access_token=${token}&q=${encodeURIComponent(
          query
        )}`;
        const { response } = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            Accept: 'application/json',
          },
        }).then((r) => r.json());
        const { hits } = response;
        console.log(hits);
        rememberSongs(hits);
      };
      console.log('running fetchGenius');
      fetchGenius(searchTerm);
    }
  }, [searchTerm, rememberSongs]);

  return (
    <div className="SearchResults">
      {songs.map((s: any) => (
        <div
          className="genius-result"
          key={s.result.id}
          data-url={s.result.url}
          onClick={callDispatchOp}
        >
          <img
            src={s.result.header_image_thumbnail_url}
            alt={s.result.title_with_featured}
          />
          <h3>{s.result.title_with_featured}</h3>
          <p>{s.result.primary_artist.name}</p>
        </div>
      ))}
    </div>
  );
};

/*
response = await fetch('https://api.genius.com/songs/4601887?access_token=Kk8yGYv93-tGb_--I0iwDhMDP8VAeGrv99MyWjk5KgepAlSGPCjTLbavINlIuyO1', {
      method: 'GET',
      mode: 'cors',
      headers: {
        Accept: 'application/json'
      }
    }).then(r => r.json());
    */