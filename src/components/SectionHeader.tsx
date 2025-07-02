export const SectionHeader = ({
    title,
    eyebrow,
    // description,
}: {
    title: string;
    eyebrow: string;
    // description: string;
}) => {
    return (
        // code from project.tsx projectSection function after conainer has done
        
        <>
        <div className="flex justify-center">
            <p className="uppercase font-semibold tracking-widest bg-gradient-to-r from-emerald-300 to-sky-400 text-transparent bg-clip-text text-center">
                {eyebrow}
            </p>
        </div>
        <h2 className="text-3xl font-serif text-center md:text-5xl mt-4 mb-10">{title}
        </h2>
        {/* <p className="text-center md:text-lg lg:text-xl text-white-500">
            {description}

        </p> */}
        
        </>
    );
;}