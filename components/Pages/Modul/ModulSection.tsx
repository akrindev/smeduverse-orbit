import Pagination from "../../Pagination/Pagination";
import ModulGrid from "./ModulGrid";
import ModulSectionSide from "./ModulSectionSide";

export default function ModulSection() {
  return (
    <div className='row g-4'>
      <div className='col-12 col-md-3'>
        <ModulSectionSide />
      </div>
      <div className='col-12 col-md-9'>
        <div className='row row-cards'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <ModulGrid />
          ))}

          <Pagination />
        </div>
      </div>
    </div>
  );
}
