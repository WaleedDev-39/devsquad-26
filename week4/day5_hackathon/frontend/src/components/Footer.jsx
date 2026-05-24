const Footer = () => {
  return (
    <div className="mt-10 bg-[#0F0F0F] ">
      <div className="lg:px-10 px-2 lg:pt-25 pt-15 pb-5 ">
        <div className="grid md:grid-cols-6 grid-cols-2 gap-5 justify-between">
          <div className="flex flex-col gap-3 text-[#999999]">
            <h5 className="font-semibold text-white">
              Home
            </h5>
            <a href="">Categories</a>
            <a href="">Devices</a>
            <a href="">Pricing</a>
            <a href="">FAQ</a>
          </div>
          <div className="flex flex-col gap-3 text-[#999999]">
            <h5 className="font-semibold text-white">Movies</h5>
            <a href="">Geners</a>
            <a href="">Trending</a>
            <a href="">New Release</a>
            <a href="">Popular</a>
          </div>
          <div className="flex flex-col gap-3 text-[#999999]">
            <h5 className="font-semibold text-white">Shows</h5>
            <a href="">Geners</a>
            <a href="">Trending</a>
            <a href="">New Release</a>
            <a href="">Popular</a>
          </div>
          <div className="flex flex-col gap-3 text-[#999999] ">
            <h5 className="font-semibold text-white">Support</h5>
            <a href="">Contact Us</a>
          </div>
          <div className="flex flex-col gap-3 text-[#999999] ">
            <h5 className="font-semibold text-white">Subscription</h5>
            <a href="">Plans</a>
            <a href="">Features</a>
          </div>
          <div className="flex flex-col gap-3 text-[#999999] ">
            <h5 className="font-semibold text-white">Connect with Us</h5>
            <div className="flex gap-2 items-center">
              <i className="flex items-center justify-center p-2 border border-[#262626] bg-[#1A1A1A] rounded-lg">
                <img
                  src="https://img.icons8.com/?size=100&id=118467&format=png&color=FFFFFF"
                  alt=""
                  className="h-5"
                />
              </i>
              <i className="flex items-center justify-center p-2 border border-[#262626] bg-[#1A1A1A] rounded-lg">
                <img
                  src="https://img.icons8.com/?size=100&id=60014&format=png&color=FFFFFF"
                  alt=""
                  className="h-5"
                />
              </i>
              <i className="flex items-center justify-center p-2 border border-[#262626] bg-[#1A1A1A] rounded-lg">
                <img
                  src="https://img.icons8.com/?size=100&id=98960&format=png&color=FFFFFF"
                  alt=""
                  className="h-5"
                />
              </i>
            </div>
          </div>
        </div>

        {/* privacy policy section */}

        <div className="text-[#999999] text-[14px] flex lg:flex-row flex-col lg:justify-between lg:items-center gap-5 mt-20 pt-5 border-t border-[#262626] whitespace-nowrap">
          <p>@2023 streamvib, All Rights Reserved</p>
          <div className="flex items-center lg:gap-5 gap-2">
            <a href="">Terms of Use</a>
            <a href="" className="border-l border-r border-[#262626] lg:px-5 px-2">Privacy Policy</a>
            <a href="">Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
