import React, { useEffect, useState } from 'react';

import { Card, FormField, Loader } from '../components';

import { CreatePost } from './index.js'

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return (
      data.map((post) => <Card key={post._id} {...post} />)
    );
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const response = await fetch('https://adamai-image-kb7e.onrender.com/api/v1/post', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);


  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));
        setSearchedResults(searchResult);
      }, 500),
    );
  };

  return (
    <section className="max-w-7xl mx-auto">
      <CreatePost />

      <div className="mt-[10%]">
      <h1 className="font-extrabold text-[#222328] text-[32px] mb-5"> Previous AdamAi Generated Images</h1>

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
          
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 inline-block">
                <RenderCards
                className='my-5  w-64 p-3 h-64'
                  data={allPosts}
                  title="No Posts Yet"
                />
            
              
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
