import { FC, useState, useEffect } from 'react';
import { Navbar, Nav, Container, Badge, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ElementCard } from './components/ElementCard';
import './ElementsPage.css';
import { FilterComponent } from './components/FilterComponent';
import { ELEMENTS_MOCK } from './modules/mock';
import planeIcon from './assets/plane.svg'
import logo from './assets/logo.svg'
import { BreadCrumbs } from './components/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from './Routes';
import { api } from './api'
import { ConfigurationElementsResult, ConfigurationElement } from './api/Api';

const ElementsPage: FC = () => {
  const [draftElementsCount, setDraftElementsCount] = useState(0);
  const [elements, setElements] = useState<ConfigurationElement[]>([]);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [loading, setLoading] = useState(true);  // Добавляем состояние для загрузки
  const navigate = useNavigate();

  useEffect(() => {
    api.planeConfigurationElements
      .planeConfigurationElementsList({
        category: category,
        price_min: minPrice,
        price_max: maxPrice,
      })
      .then((response) => {
        // Типизируем ответ согласно ConfigurationElementsResult
        const data = response.data as ConfigurationElementsResult;

        console.log("Полученные данные:", data);

        // Обновляем состояние
        if (data.configuration_elements) {
          setElements(data.configuration_elements);
        } else {
          setElements([]);  // Поставим пустой массив, если элементов нет
        }

        setDraftElementsCount(data.draft_elements_count || 0);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных:", error);
        // Используем моковые данные в случае ошибки
        setElements(ELEMENTS_MOCK.configuration_elements);
        setDraftElementsCount(0);
      })
      .finally(() => {
        setLoading(false);  // Завершаем загрузку
      });
  }, [category, minPrice, maxPrice]);

  const handleFilterChange = (category: string, minPrice: number, maxPrice: number) => {
    setCategory(category);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  };

  const handleLogoClick = () => navigate('/');

  return (
    <div className="elements-page">
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" role="status" variant="light" />
        </div>
      )}

      <Navbar className="bg-body-tertiary" expand="lg" >
        <Navbar.Brand onClick={handleLogoClick} style={{ cursor: 'pointer' }} className='m-3'>
          <img
            src={logo}
            alt="Nimbus Logo"
            width={30}
            height={30}
            className="d-inline-block align-top"
          />{' '}
          Nimbus
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="configuration-elements">Элементы конфигурации</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.ELEMENTS, path: ROUTES.ELEMENTS }
        ]}
      />

      <Container fluid className="mt-4 w-75">
        <h2 className='mb-4'>Элементы конфигурации</h2>
        
        {/* Фильтр и корзина */}
        <div className="filter-cart-container">
          <FilterComponent 
            selectedCategory={category} 
            selectedPriceMin={minPrice} 
            selectedPriceMax={maxPrice} 
            onFilterChange={handleFilterChange} 
          />
          <div className="cart-icon" onClick={() => navigate('')}>
            <img src={planeIcon} alt="Cart Icon" width={30} height={30} />
            <Badge pill bg="primary" className="draft-count-badge">
              {draftElementsCount}
            </Badge>
          </div>
        </div>
        
        {/* Проверяем, есть ли элементы для отображения */}
        {elements.length > 0 ? (
          <Row className="w-100">
            {elements.map((element) => (
              <Col key={element.pk} xs={12} md={6} lg={4} className="mb-4">
                <ElementCard
                  id={element.pk}
                  name={element.name}
                  price={element.price}
                  category={element.category}
                  image={element.image}
                  detail_text={element.detail_text}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="no-results">Ничего не найдено</div>
        )}
      </Container>
    </div>
  );
};

export default ElementsPage;
