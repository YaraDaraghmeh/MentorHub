type listCard = {
  name: string;
  picture: string;
};

const CardUser = ({ name, picture }: listCard) => {
  return (
    <div className="lg:w-96 lg:h-96 w-[20rem] h-[20rem] inline-flex flex-col justify-center items-center bg-[var(--secondary-light)] rounded-3xl shadow-[0px_0px_12px_0px_rgba(76,81,90,100%)] hover:transition-transform hover:duration-150 hover:scale-95 gap-5 overflow-hidden">
      <div className="w-fit inline-flex flex-col justify-center items-center">
        <img
          className="self-stretch h-56 "
          src={picture}
          alt="/src/assets/avatar-girl-with-glasses.png"
        />
      </div>

      <button className="flex justify-center items-center w-44 h-12 p-3.5 bg-[var(--primary)] rounded-[46px] text-[var(--gray-light)] text-2xl font-bold">
        {name}
      </button>
    </div>
  );
};

export default CardUser;
