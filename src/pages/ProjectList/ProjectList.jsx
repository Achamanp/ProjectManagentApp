import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Label } from "@/Components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group"
import { Input } from "@/Components/ui/input"
import { Search } from 'lucide-react'
import ProjectCard from '../Project/ProjectCard'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProjects, searchProjects } from '../../Redux/Project/Action'

export const tags = [
    "all", "react", "nextjs", "springboot", "mysql", "mongodb", "angular", "python", "flask", "django"
]

// Map display names to backend values
const tagMapping = {
    "all": "all",
    "react": "react", 
    "nextjs": "nextjs",
    "spring boot": "springboot", // This maps "spring boot" display to "springboot" backend value
    "springboot": "springboot",
    "mysql": "mysql",
    "mongodb": "mongodb", 
    "angular": "angular",
    "python": "python",
    "flask": "flask",
    "django": "django"
};

// Helper function to get backend value for tag
const getTagBackendValue = (displayTag) => {
    return tagMapping[displayTag.toLowerCase()] || displayTag.toLowerCase().replace(/\s+/g, '');
};

const ProjectList = () => {
    const [keyword, setKeyword] = useState("");
    const [filters, setFilters] = useState({ category: 'all', tag: 'all' });
    const { project } = useSelector(store => store);
    const dispatch = useDispatch();

    // Fetch projects on component mount and when filters change
    useEffect(() => {
        // Only fetch with filters if no search is active
        if (!keyword.trim()) {
            if (filters.category !== 'all' || filters.tag !== 'all') {
                const filterParams = {};
                if (filters.category !== 'all') filterParams.category = filters.category;
                if (filters.tag !== 'all') filterParams.tag = filters.tag;
                dispatch(fetchProjects(filterParams));
            } else {
                dispatch(fetchProjects());
            }
        } else {
        }
    }, [dispatch, filters, keyword]);

    // Handle search with debouncing
    useEffect(() => {
        if (keyword.trim()) {
            const delayDebounce = setTimeout(() => {
                dispatch(searchProjects(keyword));
            }, 500);
            return () => clearTimeout(delayDebounce);
        } else {
            // If search is cleared, fetch regular projects with current filters
            if (filters.category !== 'all' || filters.tag !== 'all') {
                const filterParams = {};
                if (filters.category !== 'all') filterParams.category = filters.category;
                if (filters.tag !== 'all') filterParams.tag = filters.tag;
                dispatch(fetchProjects(filterParams));
            } else {
                dispatch(fetchProjects());
            }
        }
    }, [keyword, dispatch, filters]);

    const handleFilterChange = (type, value) => {
        // Clear search when filters change
        if (keyword.trim()) {
            setKeyword("");
        }
        
        // For tags, ensure we're using the correct backend value
        const processedValue = type === 'tag' ? getTagBackendValue(value) : value;
        
        setFilters(prev => ({
            ...prev,
            [type]: processedValue
        }));
    }
    
    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
    }

    // Get the appropriate projects to display
    const getProjectsToDisplay = () => {
        if (keyword.trim()) {
            // Handle both array and object with data property for search results
            if (Array.isArray(project.searchProject)) {
                return project.searchProject;
            } else if (project.searchProject?.data) {
                return project.searchProject.data;
            }
            return [];
        }
        
        // For regular projects, handle the nested data structure
        if (Array.isArray(project.project)) {
            return project.project;
        } else if (project.project?.data) {
            return project.project.data;
        }
        return [];
    };
    
    return (
        <div className='relative px-5 lg:px-0 lg:flex gap-5 justify-center py-5'>
            <section className='filterSection'>
                <Card className='p-5 sticky top-10'>
                    <div className='flex justify-between lg:w-[20rem]'>
                        <p className='text-xl -tracking-wider'>filters</p>
                        <Button variant="ghost" size="icon">
                            <MixerHorizontalIcon/>
                        </Button>
                    </div>
                    <CardContent className='mt-5'>
                        <ScrollArea className="h-[70vh]">
                            <div className="space-y-10">
                                <div>
                                    <h1 className='pb-4 text-gray-400 border-b'>Category</h1>
                                    <div className='pt-6'>
                                        <RadioGroup 
                                            className="space-y-4" 
                                            value={filters.category}
                                            onValueChange={(value) => handleFilterChange("category", value)}
                                            disabled={keyword.trim() !== ""} // Disable filters during search
                                        >
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value='all' id='cat-all'/>
                                                <Label htmlFor="cat-all">all</Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value='frontend' id='cat-frontend'/>
                                                <Label htmlFor="cat-frontend">front end</Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value='fullstack' id='cat-fullstack'/>
                                                <Label htmlFor="cat-fullstack">full stack</Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value='backend' id='cat-backend'/>
                                                <Label htmlFor="cat-backend">backend</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>

                                <div>
                                    <h1 className='pb-4 text-gray-400 border-b'>Tags</h1>
                                    <div className='pt-6'>
                                        <RadioGroup 
                                            className="space-y-4" 
                                            value={filters.tag}
                                            onValueChange={(value) => handleFilterChange("tag", value)}
                                            disabled={keyword.trim() !== ""} // Disable filters during search
                                        >
                                            {tags.map((tag, index) => {
                                                const backendValue = getTagBackendValue(tag);
                                                return (
                                                    <div key={index} className="flex items-center space-x-3">
                                                        <RadioGroupItem 
                                                            value={tag} // Use display value for RadioGroup
                                                            id={`tag-${backendValue}`}
                                                        />
                                                        <Label htmlFor={`tag-${backendValue}`}>
                                                            {tag}
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                        </RadioGroup>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </section>
            <section className='projectListSection w-full lg:w-[48rem]'>
                <div className='flex gap-2 items-center pb-5 justify-between'>
                    <div className='relative p-0 w-full'>
                        <Input
                            value={keyword}
                            onChange={handleSearchChange}
                            placeholder="Search Project"
                            className="w-full pl-10 pr-4 py-2"
                        />
                        <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400"/>
                    </div>
                </div>
                <div className='space-y-5 min-h-[74vh]'>
                    {project.loading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <div>Loading projects...</div>
                        </div>
                    ) : project.error ? (
                        <div className="text-red-500 text-center min-h-[200px] flex items-center justify-center">
                            Error: {project.error}
                        </div>
                    ) : getProjectsToDisplay().length === 0 ? (
                        <div className="text-gray-500 text-center min-h-[200px] flex items-center justify-center">
                            {keyword.trim() ? "No projects found matching your search." : "No projects available."}
                        </div>
                    ) : (
                        getProjectsToDisplay().map((item) => (
                            <ProjectCard key={item.id} item={item}/>
                        ))
                    )}
                </div>
            </section>
        </div>
    )
}

export default ProjectList