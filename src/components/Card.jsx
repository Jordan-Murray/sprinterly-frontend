export default function Card({ id, name, numberOfMembers, onClick }) {
  return (
    <div
      className="cursor-pointer border border-gray-300 shadow-md rounded-md p-4 m-2 hover:bg-blue-100 hover:text-gray-800 transition-colors"
      onClick={() => onClick(id)}
    >
      <h3 className="text-lg font-semibold">{name}</h3>
      <p>{`Members: ${numberOfMembers}`}</p>
    </div>
  );
}
