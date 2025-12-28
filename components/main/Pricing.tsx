"use client";
import React, { useContext } from "react";
import { MyContext } from '@/context/context';

interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: string;
  borderColor: string;
  textColor: string;
  buttonText: string;
  isPopular?: boolean;
  gradient?: string;
}

const Pricing = () => {
  const { user, loading } = useContext(MyContext);

  const pricingPlans: PricingPlan[] = [
    {
      id: 'startup',
      name: 'Startup',
      subtitle: 'Start Strong, Start Free',
      description: 'Perfect for new startups, our free plan gets you up and running',
      price: 'Free',
      borderColor: '#393939',
      textColor: '#393939',
      buttonText: 'Join Now'
    },
    {
      id: 'professional',
      name: 'Professional',
      subtitle: 'Elevate Your Game',
      description: 'Ideal for growing businesses and professionals.',
      price: 'AED 250',
      borderColor: '#EAD200',
      textColor: '#EAD200',
      buttonText: 'Join Now',
      isPopular: true,
      gradient: 'bg-professional-gradient'
    },
    {
      id: 'business',
      name: 'Business',
      subtitle: 'Scale with Confidence',
      description: 'Designed for businesses to expand.',
      price: 'AED 500',
      borderColor: '#FF009B',
      textColor: '#FF009B',
      buttonText: 'Join Now'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      subtitle: 'Enterprise Excellence',
      description: 'Comprehensive solutions for large organizations.',
      price: 'AED 1250',
      borderColor: '#FF6C00',
      textColor: '#FF6C00',
      buttonText: 'Join Now'
    },
    {
      id: 'custom',
      name: 'Custom',
      subtitle: 'Customize and Join Now',
      description: 'Bespoke solutions to meet your unique needs.',
      price: 'Custom',
      borderColor: '#FF6C00',
      textColor: '#FF6C00',
      buttonText: 'Tailor Your Plan'
    }
  ];

  return (
    <div className="mt-5 md:my-10 lg:my-[110px] px-4 sm:px-12 lg:px-[136px] z-20" id="pricing">
      <div className="font-lora text-[36px] text-center">
        <h1 className="font-lora text-2xl lg:text-4xl text-green-900 font-bold mb-6 uppercase">Pricing</h1>
        <p className="text-base lg:text-xl text-center mb-12 lg:mb-4">Flexible IT Services with Transparent Pricing</p>
      </div>

      <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-11 lg:flex lg:flex-row lg:justify-center lg:items-center mt-3 md:mt-10 lg:mt-16 h-full">
        {pricingPlans.map((plan) => (
          <div key={plan.id} className="relative lg:basis-[18%] h-full">
            {/* Popular badge for Professional plan */}
            {plan.isPopular && (
              <div
                style={{ backgroundColor: plan.borderColor }}
                className="absolute -top-[11px] lg:-top-[22px] w-full h-[11px] rounded-tr-xl rounded-tl-xl"
              ></div>
            )}

            <div
              className={`w-full rounded-xl border-[1px] ${plan.isPopular ? 'rounded-br-xl rounded-bl-lg lg:-mt-[11px]' : ''} flex flex-col`}
              style={{ borderColor: plan.borderColor }}
            >
              <div className="text-[#393939] px-[26px] pt-[26px] pb-[20px] cursor-pointer">
                <p
                  className="font-lora text-[20px] leading-[34px] font-semibold"
                  style={{ color: plan.textColor }}
                >
                  {plan.name}
                </p>
                <p className="font-graphik font-medium text-[16px] leading-5">{plan.subtitle}</p>
                {
                  !loading && !user ? null : (
                    <div className="mt-3">
                      <span className="text-2xl font-bold" style={{ color: plan.textColor }}>
                        {plan.price}
                      </span>
                      {plan.price !== 'Free' && plan.price !== 'Custom' && (
                        <span className="text-sm text-gray-500">/month</span>
                      )}
                    </div>
                  )
                }

              </div>

              <div className="px-[25px] pt-[25px] pb-[35px] bg-[#F6F6F6] rounded-br-xl rounded-bl-xl">
                <p className="font-graphik font-normal text-[14px] leading-5 text-[#393939] mt-2">
                  {plan.description}
                </p>
                <button
                  className={`w-full rounded-md font-graphik font-semibold text-[16px] leading-[17.5px] py-[13px] mt-5 border-[1px] ${plan.gradient || ''}`}
                  style={{
                    borderColor: plan.borderColor,
                    color: plan.gradient ? '#393939' : plan.textColor
                  }}
                >
                  {plan.buttonText}
                </button>
                <div className="flex flex-col justify-start gap-[14px] mt-[21px]">
                  {/* Feature list can be added here if needed */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
