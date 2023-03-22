import React from 'react';
import CardList from '../../components/CardList/CardList';
import ContentHeader from '../../components/ContentHeader/ContentHeader';
import { useSelector } from 'react-redux';

const FavouritesPage = () => {
  const { favourites } = useSelector((state) => state.products);

  return (
    <>
      <ContentHeader title="Избранное" />
      <CardList cards={favourites} />
    </>
  );
};

export default FavouritesPage;
