import React from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="container col-xxl-8 px-4 py-5">
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
        {/* Hero Image Section */}
        <div className="col-10 col-sm-8 col-lg-6">
          <img 
            src={assets.header_img} 
            className="d-block mx-lg-auto img-fluid" 
            alt="Hero Visual"
            width="700" 
            height="500" 
            loading="lazy" 
          />
        </div>

        {/* Content Section */}
        <div className="col-lg-6">
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
            Responsive left-aligned hero with image
          </h1>
          
          <p className="lead">
            Quickly design and customize responsive mobile-first sites with Bootstrap, 
            the world's most popular front-end open source toolkit, featuring Sass variables 
            and mixins, responsive grid system, extensive prebuilt components, and powerful 
            JavaScript plugins.
          </p>

          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <button 
              type="button" 
              className="btn btn-outline-dark me-2 px-5 py-2 align-items-center"
              onClick={() => navigate('/login')}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;