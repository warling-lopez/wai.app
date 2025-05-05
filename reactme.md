useEffect(() => {
    if (!assistantResponse || assistantResponse === lastPlayedRef.current) return;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      generarAudio(assistantResponse);
    }, 300); // espera 300ms antes de ejecutar (ajustable)
    
    return () => clearTimeout(debounceTimeout.current);
  }, [assistantResponse]);


