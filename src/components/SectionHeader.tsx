export const SectionHeader = ({
    title,
    eyebrow,
    description,
}: {
    title: string;
    eyebrow: string;
    description?: React.ReactNode;
}) => {
    return (
        // code from project.tsx projectSection function after conainer has done
        
        <>
        <div className="flex justify-center text-center">
            <p className="text-xl uppercase font-bold tracking-widest bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent text-center">
                {eyebrow}
            </p>
        </div>
        <h2 className="text-3xl font-serif text-center md:text-5xl mt-1 mb-4 md:mt-4 md:mb-10">{title}
        </h2>
        {description && (
            typeof description === 'string' ? (
                <p
                    className="text-center md:text-lg lg:text-xl text-white-500 mb-3 md:mb-6"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            ) : (
                <p className="text-center md:text-lg lg:text-xl text-white-500 mb-3 md:mb-6">
                    {description}
                </p>
            )
        )}
        
        </>
    );
;}