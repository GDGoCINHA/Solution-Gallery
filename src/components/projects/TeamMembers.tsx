import Image from 'next/image';

export type TeamMember = {
  id: string;
  name: string;
  affiliation: string | null;
  profile_image_url: string | null;
  role: string | null;
  social_url?: string | null;
};

interface TeamMembersProps {
  members: TeamMember[];
}

export function TeamMembers({ members }: TeamMembersProps) {
  if (!members || members.length === 0) return null;
  return (
    <section className="w-full max-w-6xl flex flex-col items-center mb-12">
      <div className="flex flex-row flex-wrap justify-center gap-8">
        {members.map((member) => (
          <div key={member.id} className="flex flex-col items-center group cursor-pointer">
            <a href={member.social_url || '#'} target="_blank" rel="noopener noreferrer" className="block">
              <div className="w-24 h-24 flex items-center justify-center">
                <Image
                  src={member.profile_image_url || '/images/sample.jpg'}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full border-2 border-primary shadow-md group-hover:scale-105 transition-transform object-cover bg-zinc-800"
                />
              </div>
            </a>
            <div className="mt-2 text-center">
              <div className="text-base md:text-lg font-semibold text-white">{member.name}</div>
              {member.role && <div className="text-xs md:text-sm text-primary font-medium">{member.role}</div>}
              {member.affiliation && <div className="text-xs text-zinc-400 mt-0.5">{member.affiliation}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 