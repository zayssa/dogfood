import Header from '../Header/Header';
import { useCallback, useEffect, useState } from 'react';
import Logo from '../Logo/Logo';
import Search from '../Search/Search';
import Footer from '../Footer/Footer';
import api from '../../utils/api';
import SearchInfo from '../SearchInfo/SearchInfo';
import useDebounce from '../../hooks/useDebounce';
import { isLiked } from '../../utils/products';
import { Route, Routes } from 'react-router-dom';
import CatalogPage from '../../pages/CatalogPage/CatalogPage';
import ProductPage from '../../pages/ProductPage/ProductPage';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import { UserContext } from '../../context/UserContext';
import { CardContext } from '../../context/CardContext';

function Application() {
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debounceSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([api.getUserInfo(), api.getProductList()])
      .then(([userData, cardData]) => {
        setCurrentUser(userData);
        setCards(cardData.products);
      })

      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoading(false);
      })

      .catch((err) => console.error(err));
  }, []);

  const handleRequest = useCallback(() => {
    setIsLoading(true);
    api
      .search(debounceSearchQuery)
      .then((data) => {
        setCards(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, [debounceSearchQuery]);

  useEffect(() => {
    handleRequest();
  }, [handleRequest]);

  function handleFormSubmit(e) {
    e.preventDefault();
    handleRequest();
  }
  const handleInputChange = (inputValue) => {
    setSearchQuery(inputValue);
  };
  const handleUpdateUser = (userUpdate) => {
    api.setUserInfo(userUpdate).then((newUserData) => {
      setCurrentUser(newUserData);
    });
  };

  const handleProductLike = (product) => {
    const liked = isLiked(product.likes, currentUser._id); //ищем в массиве лайков id текущего пользователя.
    api.changeLikeProduct(product._id, liked).then((newCard) => {
      // в зависимости от того есть ли лайки или нет отправляем запрос "DELETE" или "PUT"
      const newCards = cards.map((card) => {
        return card._id === newCard._id ? newCard : card;
      });
      setCards(newCards);
    });
  };

  return (
    <UserContext.Provider value={{ user: currentUser, isLoading }}>
      <CardContext.Provider value={{ cards, handleLike: handleProductLike }}>
        <Header user={currentUser} updateUserHandle={handleUpdateUser}>
          <Logo className="logo logo_place_header" href="/" />
          <Search onInput={handleInputChange} onSubmit={handleFormSubmit} />
        </Header>
        <main className="content container">
          <SearchInfo searchCount={cards.length} searchText={searchQuery} />
          <Routes>
            <Route index element={<CatalogPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </CardContext.Provider>
    </UserContext.Provider>
  );
}

export default Application;
