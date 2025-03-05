import pandas as pd
import dash
from dash import dcc
from dash import html
from dash.dependencies import Input, Output
import plotly.express as px
import plotly.graph_objects as go

file_path = 'fruitvegprices-2017_2022.csv'
df = pd.read_csv(file_path)

# Convert date column to datetime
df['date'] = pd.to_datetime(df['date'])

# Replace underscores with spaces
df['category'] = df['category'].str.replace('_', ' ')
df['item'] = df['item'].str.replace('_', ' ')
df['variety'] = df['variety'].str.replace('_', ' ')

app = dash.Dash(suppress_callback_exceptions=False)

# Layout
app.layout = html.Div([

    # Single container with inputs for category, item, variety, and graph output
    html.Div([

        # Upper div containing category, item, and variety selectors
        html.Div([

            html.Label("Select Category:",
                       style={'display': 'block',
                              'marginTop': '20px',
                              'marginBottom': '10px'}),
            dcc.RadioItems(
                id='category-radio',
                options=[{'label': cat, 'value': cat}
                         for cat in df['category'].unique()],
                value=df['category'].unique()[0],
                inline=True,
                style={
                    'display': 'inline-flex',
                    'justifyContent': 'flex-start',
                    'flexWrap': 'wrap',
                    'gap': '10px',
                    'fontFamily': '"Roboto", sans-serif'  # Apply font here
                }
            ),

            html.Label("Select Item:",
                       style={
                           'display': 'block',
                           'marginTop': '20px',
                           'marginBottom': '10px',
                           'fontFamily': '"Roboto", sans-serif'  # Apply font here
                       }),
            dcc.Dropdown(
                id='item-dropdown',
                options=[],  # Populated dynamically
                value=None,
                placeholder="Select an item",
                style={
                    'border': '0.5px solid #0A7029',
                    'borderRadius': '1.5px',
                    'fontFamily': '"Roboto", sans-serif'  # Apply font here
                }
            ),

            html.Label("Select Variety:",
                       style={'display': 'block',
                              'marginTop': '20px',
                              'marginBottom': '10px',
                              'fontFamily': '"Roboto", sans-serif'  # Apply font here
                              }),
            dcc.Dropdown(
                id='variety-dropdown',
                options=[],  # Populated dynamically
                value=None,
                placeholder="Select a variety",
                style={
                    'border': '0.5px solid #0A7029',
                    'borderRadius': '1.5px',
                    'fontFamily': '"Roboto", sans-serif'  # Apply font here
                }
            ),

        ], style={
            'padding': '20px',
            'backgroundColor': 'rgba(255, 255, 255, 0.8)',
            'borderRadius': '8px',
            'boxShadow': '0px 4px 6px rgba(0, 0, 0, 0.1)',
            'marginBottom': '20px',  # Space between input section and output section
            'fontFamily': '"Roboto", sans-serif'  # Apply font to this div
        }),

        # Bottom div for price-stats and price-scatter
        html.Div([

            # Price stats on top
            html.Div(id='price-stats', style={
                'backgroundColor': '#0A7029',
                'color': 'white',
                'padding': '10px',
                'borderRadius': '8px',
                'boxShadow': '0px 4px 6px rgba(0, 0, 0, 0.1)',
                'fontSize': '16px',
                'display': 'flex',
                'flexDirection': 'column',
                'alignItems': 'center',
                'width': '90%',
                'margin': 'auto',
                'fontFamily': '"Roboto", sans-serif'  # Apply font here
            }),

            # Scatter plot
            dcc.Graph(id='price-scatter'),

        ], style={
            'padding': '25px 15px 15px 15px',
            'boxShadow': '0px -4px 6px rgba(0, 0, 0, 0.1)',
            'borderRadius': '8px',
            'fontFamily': '"Roboto", sans-serif'  # Apply font here
        }),

    ], style={
        'marginTop': '20px',  # Add space from the top
        'fontFamily': '"Roboto", sans-serif'  # Apply font to the whole layout
    }),

])

# Callback to update item dropdown based on selected category


@app.callback(
    [Output('item-dropdown', 'options'),
     Output('item-dropdown', 'value')],
    [Input('category-radio', 'value')]
)
def update_item_dropdown(selected_category):
    filtered_items = df[df['category'] == selected_category]['item'].unique()
    options = [{'label': item, 'value': item} for item in filtered_items]
    return options, (options[0]['value'] if options else None)

# Callback to update variety dropdown based on selected item


@app.callback(
    [Output('variety-dropdown', 'options'),
     Output('variety-dropdown', 'value')],
    [Input('category-radio', 'value'),
     Input('item-dropdown', 'value')]
)
def update_variety_dropdown(selected_category, selected_item):
    if not selected_item:
        return [], None

    filtered_varieties = df[(df['category'] == selected_category) & (
        df['item'] == selected_item)]['variety'].unique()

    options = [{'label': var, 'value': var} for var in filtered_varieties]
    return options, (options[0]['value'] if options else None)

# Callback to update scatter plot and price stats based on category, item, and variety


@app.callback(
    [Output('price-scatter', 'figure'),
     Output('price-stats', 'children')],
    [Input('category-radio', 'value'),
     Input('item-dropdown', 'value'),
     Input('variety-dropdown', 'value')]
)
def update_scatter_plot_and_stats(selected_category, selected_item, selected_variety):
    if not selected_item or not selected_variety:
        return go.Figure(), ""

    # Filter data
    filtered_df = df[(df['category'] == selected_category) &
                     (df['item'] == selected_item) &
                     (df['variety'] == selected_variety)]

    price_type = filtered_df['unit'].unique(
    )[0] if not filtered_df.empty else "Unknown"

    # Sort by date
    filtered_df = filtered_df.sort_values(by='date')

    # Scatter plot
    fig = px.scatter(
        filtered_df,
        x='date',
        y='price',
        title=f'Price Dynamics for {selected_item} ({selected_variety}) £ per {price_type}',
        labels={'price': 'Price', 'date': 'Date'},
        template='plotly_white'
    )

    # Set font family globally for the figure
    fig.update_layout(
        # Set the font family for the plot
        font=dict(family='"Roboto", sans-serif')
    )
    fig.update_traces(marker=dict(color='#0A7029'))

    # Price range and average for the last year
    last_year_df = filtered_df[filtered_df['date'] >
                               filtered_df['date'].max() - pd.DateOffset(years=1)]

    if not last_year_df.empty:
        min_price = last_year_df['price'].min()
        max_price = last_year_df['price'].max()
        avg_price = last_year_df['price'].mean()
        stats_range = f"Price Range (Last Year): £{min_price:.2f} - £{max_price:.2f}"
        stats_average = f"Average: £{avg_price:.2f}"
        stats = [
            html.Div(stats_range, style={'paddingBottom': '10px'}),
            html.Div(stats_average)
        ]
    else:
        stats = [html.Div("Not enough data for the last year.")]

    return fig, stats


# Run the app
if __name__ == '__main__':
    app.run_server(host='0.0.0.0', port=5000)
