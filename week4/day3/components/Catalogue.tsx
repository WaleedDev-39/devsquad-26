import React from "react";

const Catalogue = () => {
  return (
    <div className="lg:px-[181px] md:px-[60px] px-[20px] mt-[90px]">
      <div className="grid lg:grid-cols-[60%_40%] grid-cols-1 items-center gap-[46px]">
        <div>
            <img src="./assets/catalogue_img.png" alt="catalogue_image"/>
        </div>
        <div className="flex flex-col gap-5">
          <h5 className="text-[22px] text-center">Explore our Catalog</h5>
          <p className="text-[14px] text-white/60">
            Browse by genre, features, price, and more to find your next
            favorite game.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
