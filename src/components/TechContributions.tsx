const TechContributions = () => {
  return (
    <section id="contributions" className="max-w-3xl mx-auto px-6 md:px-8 py-4">
      <div className="border-t border-dashed border-border pt-6">
        <h2 className="text-xl font-body text-muted-foreground mb-8">Technical Contributions</h2>
        <div className="space-y-6 text-muted-foreground leading-relaxed text-sm">
          <p>
            <span className="text-foreground font-semibold">At Rabbit AI,</span> I worked as the lead engineer architecting{" "}
            <span className="text-foreground font-semibold">agent-based inference systems</span>. Built end-to-end GenAI pipelines with
            multi-step reasoning, RAG (Retrieval-Augmented Generation) for context-aware responses, and agentic workflows that decompose
            complex tasks into sequential execution chains.
          </p>
          <p>
            <span className="text-foreground font-semibold">Offline P2P protocol.</span> Designed and implemented a peer-to-peer data
            transfer protocol using QR-based packet streaming with Reed-Solomon error correction and collision detection. Built custom
            packetization layer that fragments data into chunks, serializes with error-checking headers, transmits via sequential QR frames
            at 60fps, and reconstructs on the receiving end with CRC32 validation. Zero network dependency. Pure offline communication.
          </p>
          <p>
            <span className="text-foreground font-semibold">Automated trading engine.</span> Developed a fully autonomous crypto trading
            bot with real-time WebSocket connections to exchange APIs, position sizing algorithms, and risk management protocols. System
            handles order execution, portfolio rebalancing, and PnL tracking with millisecond-level latency.
          </p>
          <p>
            <span className="text-foreground font-semibold">Cross-chain development.</span> I've shipped production smart contracts and
            dApps across Monad, Ethereum, Solana, and BNB Chain. Currently building on Somnia and Avalanche. Each chain has its own quirks:
            EVM-compatible chains with Solidity, Solana with Rust and the Anchor framework, different consensus mechanisms, gas optimization
            strategies, and cross-chain bridge integrations.
          </p>
          <p>
            <span className="text-foreground font-semibold">Orbix and client projects.</span> Built Orbix, an internal ops platform with
            workflow automation, task queuing, and team collaboration features. Backend runs on Node.js with PostgreSQL for relational data,
            Redis for caching, and real-time updates via WebSockets. Also delivered 5+ production websites as a freelancer, optimizing for
            Core Web Vitals, SEO performance, and sub-second load times.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TechContributions;
