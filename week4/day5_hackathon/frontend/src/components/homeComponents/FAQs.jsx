import { faqData } from "../../../data";

const FAQs = () => {
  const mid = Math.ceil(faqData.length / 2);
  const columns = [faqData.slice(0, mid), faqData.slice(mid)];
  return (
    <div className="lg:px-10 px-2">
      <div className="flex lg:flex-row flex-col justify-between lg:items-end items-start gap-5">
        <div>
          <h4 className="lg:text-[38px] text-[24px] font-bold">Frequently Asked Questions</h4>
          <p className="text-[#999999] lg:text-[18px] text-[14px]">
            Got questions? We've got answers! Check out our FAQ section to find
            answers to the most common questions about StreamVibe.
          </p>
        </div>
        <a
          href=""
          className=" bg-[#E50000]  hover:bg-red-700 border transition-all border-black px-3 py-2 rounded-lg"
        >
          Ask a Question
        </a>
      </div>

      {/* <div className="border-b-[0.2px] border-transparent bg-gradient-to-r from-[#000] via-[#e50000] to-[#000] bg-clip-border pb-[0.5px]"></div> */}

      {/* faq components */}
      {/* <div className="grid grid-rows-4 grid-flow-col gap-10 justify-between mt-10">
        {faqData.map((item) => (
          <div key={item.id} className="">
            <Disclosure>
              <div className="flex gap-2 items-center">
                <div className="bg-[#1F1F1F] px-2 py-1 rounded-md sticky top0">
                  0{item.id}
                </div>
                <div className="flex flex-col gap-2">
                  <DisclosureButton className="group flex items-center gap-2 cursor-pointer">
                    {item.question}
                    <ChevronDownIcon className="w-5 group-data-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="text-[#999999]">
                    {item.answer}
                  </DisclosurePanel>
                </div>
              </div>
            </Disclosure>
          </div>
        ))}
      </div> */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-y-0 mt-10">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-4">
            {column.map((faq) => (
              <details
                key={faq.question}
                name="faq-accordion"
                className="group"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-3.5 [&::-webkit-details-marker]:hidden">
                  <div className="flex gap-3 items-center text-sm font-medium text-neutral-100">
                    <span className="bg-[#1F1F1F] px-2 py-1 rounded-md sticky top0">
                      0{faq.id}
                    </span>
                    {faq.question}
                  </div>
                  <div className="shrink-0 rounded p-1 text-neutral-100 transition-colors hover:bg-neutral-800">
                    <svg
                      className="block group-open:hidden"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    <svg
                      className="hidden group-open:block"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                    </svg>
                  </div>
                </summary>
                <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-in-out group-open:grid-rows-[1fr] group-open:opacity-100">
                  <div className="overflow-hidden">
                    <p className="px-3.5 pb-3.5 text-sm leading-relaxed text-neutral-300">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
