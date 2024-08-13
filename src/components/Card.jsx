export default function Card({ id, name, numberOfMembers, onClick }) {
  return (
    <div
      className="bg-background rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
      onClick={() => onClick(id)}
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <div className="text-4xl font-bold">{numberOfMembers}</div>
        <p className="text-muted-foreground mt-1">Team Members</p>
      </div>
    </div>
  );
}