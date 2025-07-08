import { forwardRef } from 'react';
import Image from 'next/image';

const Card = forwardRef(({id, frontSrc, frontAlt, category, title, services, icon, className, onClick}, ref) => {
  return (
    <div className={`card ${className || ''}`} id={id} ref={ref}>
        <div className='card-wrapper'>
            <div className='flip-card-inner'>
                <div className="flip-card-front" onClick={onClick}>
                    <Image 
                        priority
                        src={frontSrc}
                        width={500}
                        height={500}
                        alt={frontAlt}
                    />
                </div>
                <div className="flip-card-back">
                    <div className="card-header">
                        <h2 className="card-category">{category}</h2>
                        <div className="card-icon">{icon}</div>
                    </div>
                    <div className="card-content">
                        <h3 className="card-title">{title}</h3>
                        <div className="services-list">
                            {services.map((service, index) => (
                                <div key={index} className="service-item">
                                    {service}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
});

Card.displayName = 'Card';

export default Card;