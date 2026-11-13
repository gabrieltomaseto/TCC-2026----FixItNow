

function CardConteudo(p){
    return(
        
        <div className={p.custom}>
            <br />
            <br />
            <h2 className="text-lg font-medium">{p.name}</h2>
            <img className="text-black text-lg font-semibold "  src={p.img} alt={p.name} />

        </div>
    );
}
export default CardConteudo;