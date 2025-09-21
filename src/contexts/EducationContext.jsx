import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const EducationContext = createContext();

export const EducationProvider = ({ children }) => {
  const [series, setSeries] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('education_articles')
        .select('*')
        .order('series_order', { ascending: true })
        .order('article_order', { ascending: true });

      if (error) throw error;

      setArticles(data);

      const groupedBySeries = data.reduce((acc, article) => {
        const seriesTitle = article.series_title;
        if (!acc[seriesTitle]) {
          acc[seriesTitle] = {
            title: seriesTitle,
            articles: [],
            order: article.series_order,
          };
        }
        acc[seriesTitle].articles.push(article);
        return acc;
      }, {});
      
      const sortedSeries = Object.values(groupedBySeries).sort((a, b) => a.order - b.order);

      setSeries(sortedSeries);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching education articles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getArticleBySlug = useCallback(async (slug) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('education_articles')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching article by slug:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteArticle = async (articleId) => {
    const { error } = await supabase
      .from('education_articles')
      .delete()
      .eq('id', articleId);
    
    if (error) {
      throw error;
    }
    
    await fetchAllArticles();
    return true;
  };

  const value = {
    series,
    articles,
    loading,
    error,
    fetchAllArticles,
    getArticleBySlug,
    deleteArticle,
  };

  return (
    <EducationContext.Provider value={value}>
      {children}
    </EducationContext.Provider>
  );
};

export const useEducation = () => {
  const context = useContext(EducationContext);
  if (context === undefined) {
    throw new Error('useEducation must be used within an EducationProvider');
  }
  return context;
};